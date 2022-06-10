/**
    Game functions and classes.
    @author Ian Buttimer
*/

import { variableCheck, requiredVariable, gameParticipantsCheck, mapToString } from './utils.js';
import { Player, Robot } from './player.js';
import { Enum, GameKey, Selection, GameMode, GameStatus, GameEvent, ResultCode } from './enums.js';

const BASIC_GAME_NAME = 'Basic';
const BIG_BANG_GAME_NAME = 'BigBang';
const XTREME_GAME_NAME = 'Xtreme';

/** 
 * Class representing a selection contest 
 */
export class Contest {

    static WIN_NAME = '<W>';
    static LOSE_NAME = '<l>';

    /** Selection that wins
     * @type {Selection} */
    winner;
    /** Selection that loses
     * @type {Selection} */
    loser;
    /** Explanation of loss; e.g. 'A beats B'
     * @type {string} */
    explanation;

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

    /** Selection this rule applies to
     * @type {Selection} */
    selection;
    /** Array of Contests for this rule's Selection
     * @type {Array}
     * @type {Contest} */
     contests = [];

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

/** Template class for a counts object */
class CountsTemplate {

    toString() {
        let str = '{';
        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                str += `${key}: ${this[key]}, `;
            }
        }
        if (str.length > 2) {
            str = str.substring(0, str.length - 2);
        }
        str += '}';

        return str;
    }
}

/**
 * Enum representing all possible game variants.
 */
 export class GameVariant extends Enum {
    // freeze variants so can't be modified
    static Basic = GameVariant.getFrozen(BASIC_GAME_NAME, basicRules());
    static BigBang = GameVariant.getFrozen(BIG_BANG_GAME_NAME, bigBangRules());
    static Xtreme = GameVariant.getFrozen(XTREME_GAME_NAME, xtremeRules());

    static AllVariants = [GameVariant.Basic, GameVariant.BigBang, GameVariant.Xtreme];

    /**
     * Make a frozen variant
     * @param {string} name - name of variant
     * @param {Array} rules - game rules
     * @returns {GameVariant}
     */
    static getFrozen(name, rules) {
        let variant = new GameVariant(name);
        variant.rules = rules;
        variant.finalise();
        return variant;
    }

    /** Array of game rules
     * @type {Array}
     * @type {Rule} */
    rules = [];
    /** Array of possible selections
     * @type {Array}
     * @type {Selection} */
    possibleSelections = [];

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
     * @returns {object} object with selection keys and count values
     */
    getCountsTemplate() {
        let template = new CountsTemplate();
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
     * @param {GameKey|string} key - GameKey or key associated with selection
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
     * @param {GameKey|string} key - GameKey or key associated with selection
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
    
    /** Result code for round 
     * @type {ResultCode} */
    resultCode;
    /** Round number
     * @type {number} */
    roundNumber;
    /** Map with players who participated in round, and their selections
     * @type {Map}
     * @type {Player} key
     * @type {Selection} value */
    playerSelections;
    /** Data dependant on round result
     * @type {*} */
    data;
    /** Explanation dependant on round result
     * @type {*} */
    explanation;

    /**
     * @constructor
     * @param {ResultCode} resultCode - result code for round
     * @param {number} roundNumber - round number result applies to
     * @param {Map} playerSelections - players who participated in round as keys and their selection as value
     * @param {Array} data - data dependant on round result
     * @param {Array} explanation - explanation dependant on round result
     */
    constructor(resultCode, roundNumber, playerSelections = new Map(), data = [], explanation = []) {
         this.resultCode = resultCode;
         this.roundNumber = roundNumber;
         this.playerSelections = playerSelections;
         this.data = data;
         this.explanation = explanation;
    }

    /**
     * All players who participated in round
     * @return {Array} array of players
     */
    get players() {
        const players = [];
        for (let player of this.playerSelections.keys()) {
            players.push(player);
        }
        return players;
    }

    /**
     * String representation of object.
     * @returns {string}
     */
     toString() {
         return `resultCode: ${this.resultCode}\n  roundNumber: ${this.roundNumber}\n  playerSelections: ${mapToString(this.playerSelections)}\n  data: ${this.data}\n  explanation: ${this.explanation}` 
     }
}

/** 
 * Class representing a game result for the event API
 */
 export class PlayEventResult {
   
    /** Game object
     * @type {Game} */
    game;
    /** Game in progress flag
     * @type {boolean} */
    gameInProgress;
    /** Round in progress flag
     * @type {boolean} */
    roundInProgress;
    /** Current player
     * @type {Player} */
    player;
    /** Result of round
     * @type {GameResult} */
    gameResult;

    /**
     * @constructor
     * @param {Game} game - game object
     * @param {GameResult} gameResult - result of round
     */
    constructor(game, gameResult) {
        this.game = game;
        this.gameResult = gameResult;
        this.gameInProgress = game.inProgress;
        this.roundInProgress = game.roundInProgress;
        this.player = game.currentPlayer;
    }
}

/**
 * Class representing a game.
 */
 export class Game {

    static OPT_NONE = 0;           // no options
    static OPT_CONSOLE = 0x01;     // log events to console

    /** Game variant 
     * @type {GameVariant} */
    variant;
    /** Game mode
     * @type {GameMode} */
    gameMode;
    /** Number of players 
     * @type {number} */
    numPlayers;
    /** Number of robots
     * @type {number} */
    numRobots;
    /** Array of game players
     * @type {Array}
     * @type {Player|Robot} */
    players;
    /** Game status
     * @type {GameStatus} */
    #status;
    /** Game options
     * @type {number} */
    #options;
    /** Current player index 
     * @type {number} */
    #currentIndex;
    /** Current round number
     * @type {number} */
    #currentRound;

    /** Function to call at key stages for test purposes with prototype
     * @type {Function} 
     * with prototype 
     * @param {GameEvent} stage - one of GameEvent.xxx
     * @param {Game} game - game object
     * @param {number} roundNumber - current round number
     * @param {object} data - current round number
     *  */
    #stageCallback;

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

        this.variant = variant;
        this.gameMode = GameMode.Live;
        this.#status = GameStatus.NotStarted;
        this.#options = options;

        this.init(numPlayers, numRobots);
    }

    /**
     * Initialise the game
     */
    init(numPlayers, numRobots, playerList = null) {
        const errors = gameParticipantsCheck(numPlayers, numRobots);
        if (errors) {
            let errorMsg = errors.reduce(
                (previousValue, currentValue) => {
                    let msg = previousValue.length ? previousValue + ', ' : previousValue;
                    return msg + currentValue
                }, ''
              );
            throw new Error(errorMsg);
        }

        if (!playerList) {
            // get array of existing player objects
            playerList = this.players ? this.players.filter(player => !player.isRobot) : [];
        }
        // get array of existing robot objects
        let robots = this.players ? this.players.filter(player => player.isRobot) : [];
        
        if (numPlayers > playerList.length) {
            // add new player objects
            for (let index = playerList.length; index < numPlayers; index++) {
                playerList.push(new Player(`Player ${index + 1}`))
            }
        } else if (numPlayers < playerList.length){
            // remove excess player objects
            playerList = playerList.slice(0, numPlayers);
        }

        if (numRobots > robots.length) {
            // add new robot objects
            for (let index = robots.length; index < numRobots; index++) {
                robots.push(new Robot(index))
            }
        } else if (numRobots < robots.length) {
            // remove excess robot objects
            robots = robots.slice(0, numRobots);
        }

        this.players = playerList.concat(robots);
        this.numPlayers = numPlayers;
        this.numRobots = numRobots;

        this.applyToPlayers(player => player.initState());
        this.#currentIndex = Game.NONE_ACTIVE;
        this.#currentRound = 0;
    }

    /**
     * Reinitialise the game
     */
     reInit(playerList = null) {
        this.init(this.numPlayers, this.numRobots, playerList);
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
            if (result.resultCode === ResultCode.Winner) {
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
     * @param {Selection|GameKey|string} selection - Selection or key associated with selection
     * @returns {Player} new current player
     */
    #makePlayNext(player, selection) {
        this.makePlay(player, selection);
        this.#currentIndex = this.nextPlayer();
        return this.getPlayer(this.#currentIndex);
    }

    /**
     * Make a play for the current player.
     * @param {Selection|GameKey|string} selection - Selection or key associated with selection
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

            if (result.resultCode === ResultCode.Winner) {
                this.endGame();
            }
        }

        return this.#eventResult(result);
    }

    /**
     * Generate an event result.
     * @param {GameResult} result - event result
     * @returns {PlayEventResult} event result object
     */
    #eventResult(result) {
        return new PlayEventResult(this, result);
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
        return this.#currentIndex !== Game.NONE_ACTIVE;
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
     *      playerSelections: Map with players who participated in round, and their selections
     *      resultCode: ResultCode.PlayAgain
     *          data: n/a
     *          explanation: n/a
     *      resultCode: ResultCode.Eliminate
     *          data: array of selections to eliminate
     *          explanation: array of explanations of eliminations
     */
    evaluateRound() {
        // default result; play again
        const roundSelections = this.roundSelections();
        const counts = roundSelections.counts;
        const evaluation = new GameResult(
            ResultCode.PlayAgain, this.#currentRound, roundSelections.playerSelections);

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
            if (top.count < this.activePlayerCount) {

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
                    evaluation.resultCode = ResultCode.Eliminate;
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
     *      playerSelections: Map with players who participated in round, and their selections
     *      resultCode: ResultCode.PlayAgain
     *          data: n/a
     *          explanation: n/a
     *      resultCode: ResultCode.Eliminate
     *          data: array eliminated players
     *          explanation: array of explanations of eliminations
     *      resultCode: ResultCode.Winner
     *          data: winning player
     *          explanation: array of explanations of eliminations
     */
    processEvaluation(evaluation) {
        let processed = new GameResult(
            evaluation.resultCode, evaluation.roundNumber, evaluation.playerSelections);
        switch (evaluation.resultCode) {
            case ResultCode.Eliminate:
                let eliminated = [];
                for (const eliminate of evaluation.data) {
                    this.players.forEach(player => {
                        if (player.inGame && player.selection === eliminate.loser) {
                            player.inGame = false;  // player eliminated
                            eliminated.push(player);
                        }
                    });
                }
                if (this.activePlayerCount === 1) {
                    // only one player remaining return winner
                    processed.resultCode = ResultCode.Winner;
                    processed.data = this.players.find(player => player.inGame);
                } else {
                    // return eliminated players
                    processed.data = eliminated;
                }
                processed.explanation = evaluation.explanation;
                break;
            default:
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
     * Get the counts for each selection and map of player selections.
     * @returns {object} {
     *          counts: {object with selection keys and count values},
     *          playerSelections: {map with players as key and selection as value}
     *      }
     */
    roundSelections() {
        const counts = this.variant.getCountsTemplate();    // selection counts
        const playerSelections = new Map();      // player selections
        this.players.forEach(player => {
            if (player.inGame) {
                counts[player.selection]++;
                playerSelections.set(player, player.selection);
            }
        });

        this.log(`roundSelections: ${counts}`, false);
        this.#doStageCallback(GameEvent.RoundSelections, counts);

        return { counts: counts, playerSelections: playerSelections };
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
     * Set the number of players
     * @param {number} num - number of players
     */
    setNumPlayers(num) {
        if (typeof num === 'string') {
            num = parseInt(num);
        }
        this.init(num, this.numRobots);
    }

    /**
     * Set the number of robots
     * @param {number} num - number of robots
     */
    setNumRobots(num) {
        if (typeof num === 'string') {
            num = parseInt(num);
        }
        this.init(this.numPlayers, num);
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
     * @returns {Player|undefined} player if valid index, otherwise undefined
     */
     getPlayer(index) {
        return index >= 0 && index < this.players.length ? this.players[index] : undefined;
    }

    /**
     * Get the current player.
     * @returns {Player|undefined} player if there is an active player, otherwise undefined
     */
    get currentPlayer() {
        return this.roundInProgress ? this.getPlayer(this.#currentIndex) : undefined;
    }

    /**
     * Get an array of players, excluding robots.
     * @returns {Array} array of players
     */
    getPlayers() {
        return this.players.filter(player => !player.isRobot);
    }

    /**
     * Get an array of robots, excluding physical players.
     * @returns {Array} array of robots
     */
     getRobots() {
        return this.players.filter(player => player.isRobot);
    }

    /**
     * Get the current round number
     * @returns {number}
     */
    get roundNumber() {
        return this.#currentRound;
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
        if (this.gameMode === GameMode.Test && typeof this.#stageCallback === 'function') {
            this.#stageCallback(stage, this, this.#currentRound, payload);
        }
    }
}

/* Jasmine requires a default export */
export default 'game.js'
