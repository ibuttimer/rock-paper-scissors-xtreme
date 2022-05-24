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
 export class Selection {
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
        this.name = name;
    }

    toString() {
        return `Selection.${this.name}`;
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
        let result = false;
        if (typeof selection === 'string') {
            // if a string is passed check the name matches
            result = this.defeats.find(element => element.name === selection) !== undefined;
        } else if (selection instanceof Selection) {
            // otherwise strict equivalence
            result = this.defeats.find(element => element === selection) !== undefined;
        }
        return result;
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
 export class GameVariant {
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
            variant.#setSelections();

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
        this.name = name;
    }

    /** Set the list of possible selections from the rules. */
    #setSelections() {
        let possibilities = [];
        for (let rule of this.rules) {
            possibilities.push(rule.selection);
        }
        this.possibleSelections = possibilities;
    }

    /**
     * Generate a random selection from all possible selections.
     * @returns {Selection} selection
     */
    randomSelection() {
        let index = Math.floor(Math.random() * this.possibleSelections.length);
        return this.possibleSelections[index];
    }

    toString() {
        return `GameVariant.${this.name}`;
    }
}

/**
 * Class representing a game.
 */
 export class Game {

    variant;        // game variant
    numPlayers;     // number of players
    numRobots;      // number of robots
    players;        // array of game players

    /**
     * @constructor
     * @param {GameVariant} variant - game variant
     * @param {number} numPlayers - number of players; default 1
     * @param {number} numRobots - number of robots; default 1
     */
    constructor(variant, numPlayers = 1, numRobots = 0) {
        // sanity checks
        requiredVariable(variant, 'variant');
        if (numPlayers + numRobots < 2) {
            throw 'Insufficient number of players';
        }

        this.variant = variant;
        this.numPlayers = numPlayers;
        this.numRobots = numRobots;

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
}

/* Jasmine requires a default export */
export default 'game.js'
