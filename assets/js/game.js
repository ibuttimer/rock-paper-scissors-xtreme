/**
    Game functions and classes.
    @author Ian Buttimer
*/

import { variableCheck, requiredVariable } from './utils.js';
import { Player, Robot } from './player.js';

const BASIC_GAME_NAME = 'Basic';
const BIG_BANG_GAME_NAME = 'BigBang';
const XTREME_GAME_NAME = 'Xtreme';


// Enum classes based on examples from https://masteringjs.io/tutorials/fundamentals/enum
/**
 * Enum representing all possible game selections.
 */
export class Enum {
    /**
     * @constructor
     * @param {string} name - enum name.
     */
    constructor(name) {
        // sanity checks
        requiredVariable(name, 'name');
        this.name = name;
    }

    /**
     * String representation of object.
     * @param {object} classDeclaration - class declaration
     * @returns {string} string of form '<Class name>.<object name>'
     */
    toString(classDeclaration) {
        return `${classDeclaration.name}.${this.name}`;
    }

    /**
     * Get a finder function suitable for use in Array.find() to match a selection.
     * @param {object|string} seeking - enum to find
     * @param {object} classDeclaration - class declaration
     * @param {function} accessor - accessor function to get Enum objects from array elements; 
     *                              default pass through
     * @returns {function}  finder function
     */
     static getFinder(seeking, classDeclaration, accessor = x => x) {
        let predicate;
        if (typeof seeking === 'string') {
            if (seeking.startsWith(`${classDeclaration.name}.`)) {
                // if toString() is passed check toString()'s matches
                predicate = element => accessor(element).toString() === seeking;
            } else {
                // check the name matches
                predicate = element => accessor(element).name === seeking;
            }
        } else {
            // otherwise strict equivalence
            predicate = element => accessor(element) === seeking;
        }
        return predicate;
    }
}

/**
 * Enum representing all possible game selections.
 */
 export class Selection extends Enum {
    // freeze selections so can't be modified
    static None = Object.freeze(new Selection('None'));     // no selection
    static Rock = Object.freeze(new Selection('Rock'));
    static Paper = Object.freeze(new Selection('Paper'));
    static Scissors = Object.freeze(new Selection('Scissors'));
    static Lizard = Object.freeze(new Selection('Lizard'));
    static Spock = Object.freeze(new Selection('Spock'));
    static Spiderman = Object.freeze(new Selection('Spiderman'));
    static Batman = Object.freeze(new Selection('Batman'));
    static Wizard = Object.freeze(new Selection('Wizard'));
    static Glock = Object.freeze(new Selection('Glock'));
  
    /**
     * @constructor
     * @param {string} name - selection name.
     */
    constructor(name) {
        super(name);
    }

    /**
     * String representation of object.
     * @returns {string} string of form '<Class name>.<object name>'
     */
    toString() {
        return super.toString(Selection);
    }

    /**
     * Get a finder function suitable for use in Array.find() to match a selection.
     * @param {object|string} element - element to find
     * @param {function} accessor - accessor function to get Selection objects from array elements; 
     *                              default pass through
     * @returns {function}  finder function
     */
     static getFinder(element, accessor = x => x) {
        return Enum.getFinder(element, Selection, accessor);
    }
}

/**
 * Class representing a game rule for a selection option.
 */
export class Rule {

    defeats = [];   // array of Selections defeated by Selection for this rule

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
     * Add a selection to the defeats list.
     * @param {Selection} selection - selection to add
     * @returns {boolean} true if added, otherwise false
     */
    addDefeat(selection) {
        let modified = false;
        // sanity checks
        if (variableCheck(selection, 'selection')) {
            if (Array.isArray(selection)) {
                this.defeats = this.defeats.concat(selection);
            } else {
                this.defeats.push(selection);
            }
            modified = true;
        }
        return modified;
    }

    /**
     * Check if Selection for this rule, defeats the specified selection.
     * @param {Selection|string} selection - selection to check
     */
    beats(selection) {
        return this.defeats.find(Selection.getFinder(selection)) !== undefined;
    }

    /**
     * Factory method to construct a Rule.
     * @param {Selection} selection - selection.
     * @param {Array} defeats - array of Selections defeated by selection
     * @returns {Selection} new object
     */
    static of(selection, defeats) {
        let rule = new Rule(selection);
        rule.addDefeat(defeats);
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
        Rule.of(Selection.Rock, Selection.Scissors),
        Rule.of(Selection.Paper, Selection.Rock),
        Rule.of(Selection.Scissors, Selection.Paper)
    ];
}

/**
 * Get Big Bang game rules.
 * @returns {Array} game rules
 */
 function bigBangRules() {
    // see https://github.com/ibuttimer/rock-paper-scissors-xtreme/blob/main/design/design.md#big-bang-rules
    return [
        Rule.of(Selection.Rock, [Selection.Scissors, Selection.Lizard]),
        Rule.of(Selection.Paper, [Selection.Rock, Selection.Spock]),
        Rule.of(Selection.Scissors, [Selection.Paper, Selection.Lizard]),
        Rule.of(Selection.Lizard, [Selection.Paper, Selection.Spock]),
        Rule.of(Selection.Spock, [Selection.Rock, Selection.Scissors])
    ];
}

/**
 * Get Xtreme game rules.
 * @returns {Array} game rules
 */
 function xtremeRules() {
    // see https://github.com/ibuttimer/rock-paper-scissors-xtreme/blob/main/design/design.md#xtreme-rules
    return [
        Rule.of(Selection.Rock, [Selection.Scissors, Selection.Lizard, Selection.Spiderman, Selection.Wizard]),
        Rule.of(Selection.Paper, [Selection.Rock, Selection.Spock, Selection.Batman, Selection.Glock]),
        Rule.of(Selection.Scissors, [Selection.Paper, Selection.Lizard, Selection.Spiderman, Selection.Wizard]),
        Rule.of(Selection.Lizard, [Selection.Paper, Selection.Spock, Selection.Batman, Selection.Glock]),
        Rule.of(Selection.Spock, [Selection.Rock, Selection.Scissors, Selection.Spiderman, Selection.Wizard]),
        Rule.of(Selection.Spiderman, [Selection.Paper, Selection.Lizard, Selection.Wizard, Selection.Glock]),
        Rule.of(Selection.Batman, [Selection.Rock, Selection.Scissors, Selection.Spock, Selection.Spiderman]),
        Rule.of(Selection.Wizard, [Selection.Paper, Selection.Lizard, Selection.Batman, Selection.Glock]),
        Rule.of(Selection.Glock, [Selection.Rock, Selection.Scissors, Selection.Spock, Selection.Batman])
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
 * Enum representing game modes.
 */
 export class GameMode extends Enum {
    // freeze game modes so can't be modified
    static Live = Object.freeze(new Selection('Live'));
    static Test = Object.freeze(new Selection('Test'));
    static Demo = Object.freeze(new Selection('Demo'));
  
    /**
     * @constructor
     * @param {string} name - game mode name.
     */
    constructor(name) {
        super(name, 'name');
    }

    /**
     * String representation of object.
     * @returns {string} string of form '<Class name>.<object name>'
     */
    toString() {
        return super.toString(GameMode);
    }
}

/**
 * Enum representing game statuses.
 */
 export class GameStatus extends Enum {
    // freeze game statuses so can't be modified
    static NotStarted = Object.freeze(new GameStatus('NotStarted'));
    static InProgress = Object.freeze(new GameStatus('InProgress'));
    static Finished = Object.freeze(new GameStatus('Finished'));
  
    /**
     * @constructor
     * @param {string} name - game mode name.
     */
    constructor(name) {
        super(name, 'name');
    }

    /**
     * String representation of object.
     * @returns {string} string of form '<Class name>.<object name>'
     */
    toString() {
        return super.toString(GameStatus);
    }
}

/**
 * Enum representing round results.
 */
 export class RoundResult extends Enum {
    // freeze game statuses so can't be modified
    /** All active players, play again */
    static PlayAgain = Object.freeze(new RoundResult('PlayAgain'));
    /** Eliminate players with specific selection(s) */
    static Eliminate = Object.freeze(new RoundResult('Eliminate'));
    /** Winner found */
    static Winner = Object.freeze(new RoundResult('Winner'));
  
    /**
     * @constructor
     * @param {string} name - game mode name.
     */
    constructor(name) {
        super(name, 'name');
    }

    /**
     * String representation of object.
     * @returns {string} string of form '<Class name>.<object name>'
     */
    toString() {
        return super.toString(RoundResult);
    }
}

/**
 * Class representing a game.
 */
 export class Game {

    variant;        // game variant
    gameMode;       // game mode
    numPlayers;     // number of players
    numRobots;      // number of robots
    players;        // array of game players
    #status;        // game status

    /**
     * @constructor
     * @param {GameVariant} variant - game variant
     * @param {number} numPlayers - number of players; default 1
     * @param {number} numRobots - number of robots; default 1
     */
    constructor(variant, numPlayers = 1, numRobots = 1) {
        // sanity checks
        requiredVariable(variant, 'variant');
        if (numPlayers + numRobots < 2) {
            throw 'Insufficient number of players';
        }

        this.variant = variant;
        this.gameMode = GameMode.Live;
        this.numPlayers = numPlayers;
        this.numRobots = numRobots;
        this.#status = GameStatus.NotStarted;

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
    }

    /**
     * Run the game
     */
    runGame() {
        // start game
        startGame();

    }

    /**
     * Start the game
     */
    startGame() {
        this.#status = GameStatus.InProgress;
        this.applyToPlayers(player => {
            player.initState();
            player.inGame = true
        });
    }

    /**
     * End the game
     */
    endGame() {
        this.#status = GameStatus.Finished;
        this.applyToPlayers(player => player.inGame = false);
    }

    /**
     * Play a round of the game.
     */
    playRound() {

    }

    /**
     * Evaluate the result of a round.
     * @returns {object} result of the form {
     *      result: one of RoundResult,
     *      data: PlayAgain - n/a
     *            Eliminate - array of selections to eliminate,
     *            Winner - winning selection ??
     *    }
     */
    evaluateRound() {
        // default result; play again
        let evaluation = {
            result: RoundResult.PlayAgain,
            data: null
        };
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

                // only if a selection does not appear in the defeats of another selection 
                // can it be activated, otherwise its ignored
                for (const pick of countEntries) {
                    for (const otherPick of countEntries) {
                        if (pick !== otherPick) {
                            // does pick lose to otherPick?
                            if (otherPick.rule.beats(pick.selection)) {
                                pick.nullified = true;
                            }
                        }
                    }
                }

                let eliminated = [];    // selections which lose
                let activated = 0;      // num of winning selections
                for (const pick of countEntries) {
                    if (!pick.nullified) {
                        ++activated;
                        eliminated = eliminated.concat(pick.rule.defeats);
                    }
                }

                if (activated > 0) {
                    // eliminate losers
                    evaluation.result = RoundResult.Eliminate;
                    evaluation.data = eliminated;
                }
                // else play again
            }
            // else all same selection, so play again
        }

        return evaluation;
    }

    /**
     * Process evaluation of a round.
     * @param {object} evaluation - result from evaluateRound()
     * @returns {object} result of the form {
     *      result: one of RoundResult,
     *      data: PlayAgain - n/a
     *            Winner - winning player
     *    }
     */
    processEvaluation(evaluation) {
        let processed = {
            result: RoundResult.PlayAgain,
            data: null
        };
        switch (evaluation.result) {
            case RoundResult.Eliminate:
                let eliminated = [];
                for (const selection of evaluation.data) {
                    this.players.forEach(player => {
                        if (player.inGame && player.selection === selection) {
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
                break;
        }
        return processed;
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
}

/* Jasmine requires a default export */
export default 'game.js'
