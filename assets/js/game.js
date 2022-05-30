/**
    Game functions and classes.
    @author Ian Buttimer
*/

import { variableCheck, requiredVariable } from './utils.js';
import { Player, Robot } from './player.js';
import { Enum, GameKey, Selection, GameMode, GameStatus, GameEvent, RoundResult } from './enums.js';

const BASIC_GAME_NAME = 'Basic';
const BIG_BANG_GAME_NAME = 'BigBang';
const XTREME_GAME_NAME = 'Xtreme';

/** 
 * Class representing a selection contest 
 */
export class Contest {

    static WIN_NAME = '<W>';
    static LOSE_NAME = '<l>';

    winner;         // selection that wins
    loser;          // selection that loses
    explanation;    // explanation of loss

    /**
     * @constructor
     * @param {Selection} winner - selection that wins.
     * @param {Selection} loser - selection that loses.
     * @param {string} action - action performed
     */
     constructor(winner, loser, action) {
        // sanity checks
        requiredVariable(winner, 'winner');
        requiredVariable(loser, 'loser');
        if (!variableCheck(action, 'action')) {
            action = `beats`
        }
        if (action.indexOf(Contest.WIN_NAME) === -1) {
            action = `${Contest.WIN_NAME} ${action} ${Contest.LOSE_NAME}`
        }

        this.winner = winner;
        this.loser = loser;
        this.explanation = action.replace(Contest.WIN_NAME, winner.name)
                                .replace(Contest.LOSE_NAME, loser.name);
    }

    /**
     * Factory method to construct a Contest.
     * @param {Selection} winner - selection that wins.
     * @param {Selection} loser - selection that loses.
     * @param {string} action - action performed
     * @returns {Contest} new object
     */
     static of(winner, loser, action) {
        return new Contest(winner, loser, action);
    }

    /**
     * String representation of object.
     * @returns {string}
     */
     toString() {
        return `{${this.winner}, ${this.loser}, ${this.explanation}}`;
    }
}

/** 
 * Class representing a game rule for a selection option.
 */
export class Rule {

    selection;      // selection this rule applies to
    contests = [];  // array of Contests for this rule's Selection

    /**
     * @constructor
     * @param {Selection} selection - selection.
     */
     constructor(selection) {
        // sanity checks
        requiredVariable(selection, 'selection');
        this.selection = selection;
    }

    /**
     * Add a contest to the contests list.
     * @param {Contest|Array} contest - Contest(s) to add
     * @returns {boolean} true if added, otherwise false
     */
    addContest(contest) {
        let modified = false;
        // sanity checks
        if (variableCheck(contest, 'loser')) {
            if (Array.isArray(contest)) {
                this.contests = this.contests.concat(contest);
            } else {
                this.contests.push(contest);
            }
            modified = true;
        }
        return modified;
    }

    /**
     * Search this rule's contests for the specified losing selection.
     * @param {Selection|string} selection - selection to check
     * @returns {Contest|undefined} loser or undefined
     */
    #findContest(selection) {
        return this.contests.find(Selection.getFinder(selection, x => x.loser));
    }

    /**
     * Check if the Selection for this rule, beats the specified selection.
     * @param {Selection|string} selection - selection to check
     * @returns {boolean} true if this rule contests the specified selection
     */
    beats(selection) {
        return this.#findContest(selection) !== undefined;
    }

    /**
     * Explain why the Selection for this rule, beats the specified selection.
     * @param {Selection|string} selection - selection to check
     * @returns {string|undefined} explanation if this rule beats the specified selection, otherwise undefined
     */
    explanation(selection) {
        const loser = this.#findContest(selection);
        return loser ? loser.explanation : null;
    }

    /**
     * Factory method to construct a Rule.
     * @param {Selection} selection - selection.
     * @param {Contest|Array} contests - Contest(s) to add
     * @returns {Selection} new object
     */
    static of(selection, contests) {
        let rule = new Rule(selection);
        rule.addContest(contests);
        return rule;
    }
}

/**
 * Get Basic game rules.
 * @returns {Array} game rules
 */
function basicRules() {
    // see https://github.com/ibuttimer/rock-paper-scissors-xtreme/blob/main/design/design.md#basic-rules
    return [
        Rule.of(Selection.Rock, Contest.of(Selection.Rock, Selection.Scissors, 'blunts')),
        Rule.of(Selection.Paper, Contest.of(Selection.Paper, Selection.Rock, 'covers')),
        Rule.of(Selection.Scissors, Contest.of(Selection.Scissors, Selection.Paper, 'cuts'))
    ];
}

/**
 * Get Big Bang game rules.
 * @returns {Array} game rules
 */
function bigBangRules() {
    // see https://github.com/ibuttimer/rock-paper-scissors-xtreme/blob/main/design/design.md#big-bang-rules
    return [
        Rule.of(Selection.Rock, [
            Contest.of(Selection.Rock, Selection.Scissors, 'blunts'), 
            Contest.of(Selection.Rock, Selection.Lizard, 'crushes')
        ]),
        Rule.of(Selection.Paper, [
            Contest.of(Selection.Paper, Selection.Rock, 'covers'), 
            Contest.of(Selection.Paper, Selection.Spock, 'disproves')
        ]),
        Rule.of(Selection.Scissors, [
            Contest.of(Selection.Scissors, Selection.Paper, 'cuts'), 
            Contest.of(Selection.Scissors, Selection.Lizard, 'decapitates')
        ]),
        Rule.of(Selection.Lizard, [
            Contest.of(Selection.Lizard, Selection.Paper, 'eats'), 
            Contest.of(Selection.Lizard, Selection.Spock, 'poisons')
        ]),
        Rule.of(Selection.Spock, [
            Contest.of(Selection.Spock, Selection.Rock, 'vaporises'), 
            Contest.of(Selection.Spock, Selection.Scissors, 'smashes')
        ])
    ];
}

/**
 * Get Xtreme game rules.
 * @returns {Array} game rules
 */
function xtremeRules() {
    // see https://github.com/ibuttimer/rock-paper-scissors-xtreme/blob/main/design/design.md#xtreme-rules
    return [
        Rule.of(Selection.Rock, [
            Contest.of(Selection.Rock, Selection.Scissors, 'blunts'), 
            Contest.of(Selection.Rock, Selection.Lizard, 'crushes'), 
            Contest.of(Selection.Rock, Selection.Spiderman, 'knocks out'), 
            Contest.of(Selection.Rock, Selection.Wizard, 'interrupts')
        ]),
        Rule.of(Selection.Paper, [
            Contest.of(Selection.Paper, Selection.Rock, 'covers'), 
            Contest.of(Selection.Paper, Selection.Spock, 'disproves'), 
            Contest.of(Selection.Paper, Selection.Batman, 'delays'), 
            Contest.of(Selection.Paper, Selection.Glock, 'jams')
        ]),
        Rule.of(Selection.Scissors, [
            Contest.of(Selection.Scissors, Selection.Paper, 'cuts'), 
            Contest.of(Selection.Scissors, Selection.Lizard, 'decapitates'), 
            Contest.of(Selection.Scissors, Selection.Spiderman, 'cuts'), 
            Contest.of(Selection.Scissors, Selection.Wizard, 'cuts')
        ]),
        Rule.of(Selection.Lizard, [
            Contest.of(Selection.Lizard, Selection.Paper, 'eats'), 
            Contest.of(Selection.Lizard, Selection.Spock, 'poisons'), 
            Contest.of(Selection.Lizard, Selection.Batman, 'confuses'), 
            Contest.of(Selection.Lizard, Selection.Glock, 'is too small for')
        ]),
        Rule.of(Selection.Spock, [
            Contest.of(Selection.Spock, Selection.Rock, 'vaporises'), 
            Contest.of(Selection.Spock, Selection.Scissors, 'smashes'), 
            Contest.of(Selection.Spock, Selection.Spiderman, 'befuddles'), 
            Contest.of(Selection.Spock, Selection.Wizard, 'zaps')
        ]),
        Rule.of(Selection.Spiderman, [
            Contest.of(Selection.Spiderman, Selection.Paper, 'rips'), 
            Contest.of(Selection.Spiderman, Selection.Lizard, 'contests'), 
            Contest.of(Selection.Spiderman, Selection.Wizard, 'annoys'), 
            Contest.of(Selection.Spiderman, Selection.Glock, 'disarms')
        ]),
        Rule.of(Selection.Batman, [
            Contest.of(Selection.Batman, Selection.Rock, 'explodes'), 
            Contest.of(Selection.Batman, Selection.Scissors, 'dismantles'), 
            Contest.of(Selection.Batman, Selection.Spock, 'hangs'), 
            Contest.of(Selection.Batman, Selection.Spiderman, 'scares')
        ]),
        Rule.of(Selection.Wizard, [
            Contest.of(Selection.Wizard, Selection.Paper, 'burns'), 
            Contest.of(Selection.Wizard, Selection.Lizard, 'transforms'), 
            Contest.of(Selection.Wizard, Selection.Batman, 'stuns'), 
            Contest.of(Selection.Wizard, Selection.Glock, 'melts')
        ]),
        Rule.of(Selection.Glock, [
            Contest.of(Selection.Glock, Selection.Rock, 'breaks'), 
            Contest.of(Selection.Glock, Selection.Scissors, 'dents'), 
            Contest.of(Selection.Glock, Selection.Spock, 'shoots'), 
            Contest.of(Selection.Glock, Selection.Batman, `${Contest.WIN_NAME} kills ${Contest.LOSE_NAME}’s mum`)
        ])
    ];
}

/**
 * Enum representing all possible game variants.
 */
 export class GameVariant extends Enum {
    // freeze variants so can't be modified
    static Basic;
    static BigBang;
    static Xtreme;
  
    static {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Class_static_initialization_blocks
        let variants = {};
        variants[BASIC_GAME_NAME] = basicRules;
        variants[BIG_BANG_GAME_NAME] = bigBangRules;
        variants[XTREME_GAME_NAME] = xtremeRules;

        for (let name in variants) {
            let variant = new GameVariant(name);
            variant.rules = variants[name]();
            variant.finalise();

            switch (name) {
                case BASIC_GAME_NAME:
                    this.Basic = Object.freeze(variant);
                    break;
                case BIG_BANG_GAME_NAME:
                    this.BigBang = Object.freeze(variant);
                    break;
                case XTREME_GAME_NAME:
                    this.Xtreme = Object.freeze(variant);
                    break;
            }
        }
    }

    rules = [];              // array of game rules
    possibleSelections = []; // array of possible selections

    /**
     * @constructor
     * @param {string} name - variant name.
     */
    constructor(name) {
        super(name);
    }

    /** Finalise object to prepare for freezing. */
    finalise() {
        // Set the list of possible selections from the rules
        let possibilities = [];
        for (let rule of this.rules) {
            if (possibilities.find(possibility => possibility === rule.selection)) {
                throw new Error(`Rule already exists for ${rule.selection}`);
            }
            possibilities.push(rule.selection);
        }
        this.possibleSelections = possibilities;
    }

    /**
     * Get the number of possible selections.
     * @returns {number} number of selections
     */
    get numPossibleSelections() {
        return this.possibleSelections.length;
    }

    /**
     * Get a selection counts template object.
     * @returns {object} map with selection keys and count values
     */
    getCountsTemplate() {
        let template = {};
        this.possibleSelections.forEach(selection => template[selection] = 0);
        return template;
    }

    /**
     * Get the rule for the specified selection.
     * @param {Selection|string} selection - selection to get rule for
     * @returns {Rule} rule or undefined
     */
    getRule(selection) {
        return this.rules.find(Selection.getFinder(selection, rule => rule.selection));
    }

    /**
     * Get selection for specified key.
     * @param {GameKey|string} key - key associated with selection
     * @returns {Selection}  selection or Selection.None if invalid key
     */
    getSelection(key) {
        // match the GameKey object or the key string
        let matcher = key instanceof GameKey ? sel => sel.key === key : sel => sel.key.matches(key);
        let selection = this.possibleSelections.find(matcher);
        return selection ? selection : Selection.None;
    }

    /**
     * Check if selection key is valid.
     * @param {GameKey|string} key - key associated with selection
     * @returns {boolean} true if key is valid otherwise false
     */
    isValidKey(key) {
        return this.getSelection(key) !== Selection.None;
    }

    /**
     * Check if selection is valid.
     * @param {Selection|string} selection - selection to check
     * @returns {boolean} true if selection is valid otherwise false
     */
    isValidSelection(selection) {
        return this.possibleSelections.find(Selection.getFinder(selection)) !== undefined;
    }

    /**
     * Generate a random selection from all possible selections.
     * @returns {Selection} selection
     */
    randomSelection() {
        let index = Math.floor(Math.random() * this.possibleSelections.length);
        return this.possibleSelections[index];
    }

    /**
     * String representation of object.
     * @returns {string} string of form '<Class name>.<object name>'
     */
    toString() {
        return super.toString(GameVariant);
    }
}

/** 
 * Class representing a game result 
 */
export class GameResult {
    
    result;         // round result
    data;           // data dependant on round result
    explanation;    // explanation dependant on round result

    /**
     * @constructor
     * @param {RoundResult} result - round result
     * @param {Array} data - data dependant on round result
     * @param {Array} explanation - explanation dependant on round result
     */
     constructor(result, data = [], explanation = []) {
         this.result = result;
         this.data = data;
         this.explanation = explanation;
     }

    /**
     * String representation of object.
     * @returns {string}
     */
     toString() {
         return `result: ${this.result}\n  data: ${this.data}\n  explanation: ${this.explanation}` 
     }
}

/**
 * Class representing a game.
 */
 export class Game {

    static OPT_NONE = 0;           // no options
    static OPT_CONSOLE = 0x01;     // log events to console

    variant;        // game variant
    gameMode;       // game mode
    numPlayers;     // number of players
    numRobots;      // number of robots
    players;        // array of game players
    #status;        // game status
    #options;       // game options
    #currentIndex;  // current player index
    #currentRound;  // current round number

    #stageCallback; // function to call at key stages for test purposes with prototype
                    // * param {GameEvent} stage - one of GameEvent.xxx
                    // * param {Game} game - game object
                    // * param {number} roundNumber - current round number
                    // * param {object} data - current round number

    static NONE_ACTIVE = -1; // no active player index

    /**
     * @constructor
     * @param {GameVariant} variant - game variant
     * @param {number} numPlayers - number of players; default 1
     * @param {number} numRobots - number of robots; default 1
     * @param {number} options - OR bitmask of OPTxxx; default OPT_NONE
     */
    constructor(variant, numPlayers = 1, numRobots = 1, options = Game.OPT_NONE) {
        // sanity checks
        requiredVariable(variant, 'variant');
        if (numPlayers + numRobots < 2) {
            throw 'Insufficient number of players';
        }
        if (numPlayers < 1) {
            throw 'Insufficient number of players';
        }

        this.variant = variant;
        this.gameMode = GameMode.Live;
        this.numPlayers = numPlayers;
        this.numRobots = numRobots;
        this.#status = GameStatus.NotStarted;
        this.#options = options;

        this.init();
    }

    /**
     * Initialise the game
     */
    init() {
        this.players = [];
        for (let i = 0; i < this.numPlayers; i++) {
            this.players.push(new Player());
        }
        for (let i = 0; i < this.numRobots; i++) {
            this.players.push(new Robot());
        }
        this.#currentIndex = Game.NONE_ACTIVE;
        this.#currentRound = 0;
    }

    /**
     * Start the game
     */
    startGame() {
        this.#status = GameStatus.InProgress;
        this.#currentRound = 0;
        this.applyToPlayers(player => {
            player.initState();
            player.inGame = true
        });

        this.log('startGame');
        this.#doStageCallback(GameEvent.GameStart);
    }

    /**
     * End the game
     */
    endGame() {
        this.#status = GameStatus.Finished;
        this.applyToPlayers(player => player.initState());

        this.log('endGame');
        this.#doStageCallback(GameEvent.GameEnd);
    }

    /**
     * Play the game using a callback function. 
     * All game input is obtained by calls to the callback function. 
     * @param {Function} callback - function to call for each player with prototype
     *                              function(player, playerIndex, roundNumber)
     *                              param {Game} game - game object
     *                              param {number} playerIndex - index of current player
     *                              param {number} roundNumber - current round number
     *                              returns {Selection|string} Selection or key associated with selection
     */
    playGame(callback) {
        let result;
        this.startGame();
        while (this.inProgress) {
            result = this.playRound(callback);
            if (result.result == RoundResult.Winner) {
                this.endGame();
            }
        }
        return result;
    }

    /**
     * Play a round of the game.
     * @param {Function} callback - function to call for each player with prototype
     *                              function(player, playerIndex, roundNumber)
     *                              param {Game} game - game object
     *                              param {number} playerIndex - index of current player
     *                              param {number} roundNumber - current round number
     *                              returns {Selection|string} Selection or key associated with selection
     * @returns {GameResult} @see {@link Game#processEvaluation()}
     */
    playRound(callback) {
        this.startRound();
        while (this.roundInProgress) {
            const player = this.getPlayer(this.#currentIndex);
            const selection = callback(this, this.#currentIndex, this.#currentRound);
            this.makePlay(player, selection);
            this.#currentIndex = this.nextPlayer();
        }
        const evaluation = this.evaluateRound();
        return this.processEvaluation(evaluation);
    }

    /**
     * Play the game using the events driven interface.
     * All game input is obtained by external calls to the following functions:
     * - playGameEvents()
     * - makePlayEvent()
     * @returns {object} event result, @see {@link Game#eventResult()}
     */
    playGameEvents() {
        this.startGame();
        this.startRound();
        return this.#eventResult(null);
    }

    /**
     * Make a play for the current player and set the next player.
     * @param {Player} player - current player
     * @param {GameKey|string} selection - key for selection
     * @returns {Player} new current player
     */
    #makePlayNext(player, selection) {
        this.makePlay(player, selection);
        this.#currentIndex = this.nextPlayer();
        return this.getPlayer(this.#currentIndex);
    }

    /**
     * Make a play for the current player.
     * @param {string} selection - key for selection
     * @returns {object} event result, @see {@link Game#eventResult()}
     */
    makePlayEvent(selection) {
        let player = this.#makePlayNext(
            this.getPlayer(this.#currentIndex), selection);

        // make plays for any robots
        while (this.roundInProgress && player && player.isRobot) {
            player = this.#makePlayNext(player, Selection.Random);
        }

        // if all player have played, evaluate & process round
        let result = null;
        if (!this.roundInProgress) {
            const evaluation = this.evaluateRound();
            result = this.processEvaluation(evaluation);

            if (result.result == RoundResult.Winner) {
                this.endGame();
            } else if (result.result == RoundResult.PlayAgain){
                this.startRound();
            }
        }

        return this.#eventResult(result);
    }

    /**
     * Generate an event result.
     * @param {object} result - event result
     * @returns {object} event result object
     */
    #eventResult(result) {
        return {
            game: this,
            gameInProgress: this.inProgress,
            roundInProgress: this.roundInProgress,
            player: this.getPlayer(this.#currentIndex),
            playerIndex: this.#currentIndex,
            result: result
        }
    }

    /** Start a round */
    startRound() {
        this.#currentIndex = Game.NONE_ACTIVE;
        this.#currentIndex = this.nextPlayer();
        ++this.#currentRound;

        this.log(`startRound ${this.#currentRound}`);
        this.#doStageCallback(GameEvent.RoundStart);
    }

    /**
     * Check if a round is in progress.
     * @returns {boolean} true if in progress, otherwise false
     */
    get roundInProgress() {
        return this.#currentIndex != Game.NONE_ACTIVE;
    }

    /**
     * Gets the index of the next player.
     * @returns {number} index of next player or NONE_ACTIVE if not found
     */
    nextPlayer() {
        return this.players.findIndex((player, index) => index > this.#currentIndex && player.inGame);
    }

    /**
     * Evaluate the result of a round.
     * @returns {GameResult} with:
     *      result: one of RoundResult,
     *      data: PlayAgain - n/a
     *            Eliminate - array of selections to eliminate,
     *            Winner - winning selection ??
     *      explanation: PlayAgain - n/a
     *                   Eliminate - array of explanations of eliminations,
     *                   Winner - winning selection ??
     */
    evaluateRound() {
        // default result; play again
        let evaluation = new GameResult(RoundResult.PlayAgain);
        let counts = this.roundSelections();

        // check if all selections picked
        let allPicked = (Object.values(counts).find(count => count === 0) === undefined);
        if (!allPicked) {
            // find selection(s) with biggest count
            let countEntries = [];
            for (const [key, value] of Object.entries(counts)) {
                if (value === 0) {
                    continue;   // ignore unselected
                }
                countEntries.push({
                    selection: key,     // selection
                    count: value,       // num of players who picked it
                    rule: this.variant.getRule(key), // selection's rule
                    nullified: false    // nullified if loses to another picked selection
                });
            }
            countEntries.sort((a, b) => b.count - a.count); // sort descending order of count
            const top = countEntries[0];
            
            // check if all same selection
            if (top.count < Object.keys(counts).length) {

                let eliminated = [];    // selections which lose
                let explanations = [];  // explanation of losses
                let activated = 0;      // num of winning selections

                // only if a selection does not appear in the contests of another selection 
                // can it be activated, otherwise its ignored
                for (const pick of countEntries) {
                    for (const otherPick of countEntries) {
                        if (pick !== otherPick) {
                            // does pick lose to otherPick?
                            if (otherPick.rule.beats(pick.selection)) {
                                pick.nullified = true;
                            }
                            else {
                                // add explanation
                                explanations.push(
                                    pick.rule.explanation(otherPick.selection));
                            }
                        }
                    }
                }

                for (const pick of countEntries) {
                    if (!pick.nullified) {
                        ++activated;
                        eliminated = eliminated.concat(pick.rule.contests);
                    }
                }

                if (activated > 0) {
                    // eliminate losers
                    evaluation.result = RoundResult.Eliminate;
                    evaluation.data = eliminated;
                    evaluation.explanation = explanations;
                }
                // else play again
            }
            // else all same selection, so play again
        }

        this.log(`evaluateRound: ${evaluation}`);
        this.#doStageCallback(GameEvent.RoundEvaluation, evaluation);

        return evaluation;
    }

    /**
     * Process evaluation of a round.
     * @param {object} evaluation - result from evaluateRound()
     * @returns {GameResult} with:
     *      result: one of RoundResult,
     *      data: PlayAgain - n/a
     *            Eliminate - array eliminated players,
     *            Winner - winning player
     */
    processEvaluation(evaluation) {
        let processed = new GameResult(RoundResult.PlayAgain);
        switch (evaluation.result) {
            case RoundResult.Eliminate:
                let eliminated = [];
                for (const eliminate of evaluation.data) {
                    this.players.forEach(player => {
                        if (player.inGame && player.selection === eliminate.loser) {
                            player.inGame = false;  // player eliminated
                            eliminated.push(player);
                        }
                    });
                }
                if (this.activePlayerCount == 1) {
                    // only one player remaining return winner
                    processed.result = RoundResult.Winner;
                    processed.data = this.players.find(player => player.inGame);
                } else {
                    // return eliminated players
                    processed.data = eliminated;
                }
                processed.explanation = evaluation.explanation;
                break;
        }

        this.log(`processEvaluation: ${processed}`);
        this.#doStageCallback(GameEvent.RoundProcessed, processed);

        return processed;
    }

    /**
     * Make a selection for a player.
     * @param {Player|number} player - player or player index
     * @param {Selection|GameKey|string} selection - Selection or key associated with selection
     * @returns {Selection} if selection was set the Selection, otherwise Selection.None
     */
    makePlay(player, selection) {
        let selectionSet = Selection.None;
        if (typeof player === 'number') {
            player = this.getPlayer(player);
        }
        if (player && player.inGame) {
            selectionSet = player.setSelection(selection, this.gameMode, this.variant);
        }

        this.log(`makePlay: ${player} ${selectionSet}`);

        return selectionSet;
    }

    /**
     * Get the counts for each selection
     * @returns {object} map with selection keys and count values
     */
     roundSelections() {
        let counts = this.variant.getCountsTemplate();
        this.players.forEach(player => {
            if (player.inGame) {
                counts[player.selection]++;
            }
        });

        this.log(`roundSelections: ${counts}`, false);
        this.#doStageCallback(GameEvent.RoundSelections, counts);

        return counts;
    }

    /**
     * Check if game has not started.
     * @returns {boolean} true if not started
     */
    get notStarted() {
        return this.#status === GameStatus.NotStarted;
    }

    /**
     * Check if game is in progress.
     * @returns {boolean} true if in progress
     */
    get inProgress() {
        return this.#status === GameStatus.InProgress;
    }

    /**
     * Check if game is in finished.
     * @returns {boolean} true if finished
     */
    get isOver() {
        return this.#status === GameStatus.Finished;
    }

    /**
     * Apply the applicator to all players
     * @param {Function} applicator 
     */
    applyToPlayers(applicator) {
        this.players.forEach(player => applicator(player));
    }

    /**
     * Get the number of players; both active and inactive.
     * @returns {number} player count
     */
     get playerCount() {
        return this.players.length;
    }

    /**
     * Get the number of active players
     * @returns {number} player count
     */
    get activePlayerCount() {
        return this.players.reduce(
            (previousValue, player) => previousValue + (player.inGame ? 1 : 0),
            0   // initial count
        );
    }

    /**
     * Get the player with the specified index.
     * @param {number} index - index of player
     * @returns {Player|undefined} player is valid index, otherwise undefined
     */
    getPlayer(index) {
        return index >= 0 && index < this.players.length ? this.players[index] : undefined;
    }

    /**
     * Log a message.
     * @param {string} message - message to log
     */
    log(message) {
        if (this.#options & Game.OPT_CONSOLE) {
            console.log(message);
        }
    }

    /**
     * Set game mode.
     * @param {GameMode} gameMode - mode to set
     * @param {function} callback - callback function; default undefined
     */
    setGameMode(gameMode, callback = undefined) {
        this.gameMode = gameMode
        this.#stageCallback = callback;
    }

    /**
     * Call stage callback function when in test mode.
     * @param {GameEvent} stage - one of GameEvent.xxx
     * @param {object} payload - stage data
     */
    #doStageCallback(stage, payload = undefined) {
        if (this.gameMode == GameMode.Test && typeof this.#stageCallback === 'function') {
            this.#stageCallback(stage, this, this.#currentRound, payload);
        }
    }
}

/* Jasmine requires a default export */
export default 'game.js'
