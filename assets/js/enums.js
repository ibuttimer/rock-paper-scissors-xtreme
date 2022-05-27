/**
    Enum classes.
    Based on examples from https://masteringjs.io/tutorials/fundamentals/enum
    @author Ian Buttimer
*/
import { requiredVariable } from './utils.js';

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

/* Jasmine requires a default export */
export default 'enums.js'
