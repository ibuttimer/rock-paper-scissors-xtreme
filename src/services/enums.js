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
 * Enum representing game keys.
 */
 export class GameKey extends Enum {
    // freeze game keys so can't be modified
    static Ignore = Object.freeze(new GameKey('Ignore'));
    static NewGame = Object.freeze(new GameKey('NewGame', 'n'));
    static Random = Object.freeze(new GameKey('Random', '#'));
    static Rock = Object.freeze(new GameKey('Rock', 'r'));
    static Paper = Object.freeze(new GameKey('Paper', 'p'));
    static Scissors = Object.freeze(new GameKey('Scissors', 's'));
    static Lizard = Object.freeze(new GameKey('Lizard', 'l'));
    static Spock = Object.freeze(new GameKey('Spock', 'v'));
    static Spiderman = Object.freeze(new GameKey('Spiderman', 'i'));
    static Batman = Object.freeze(new GameKey('Batman', 'b'));
    static Wizard = Object.freeze(new GameKey('Wizard', 'w'));
    static Glock = Object.freeze(new GameKey('Glock', 'g'));

    static SelectionKeys = [
        GameKey.Random, GameKey.Rock, GameKey.Paper, GameKey.Scissors, GameKey.Lizard,
        GameKey.Spock, GameKey.Spiderman, GameKey.Batman, GameKey.Wizard, GameKey.Glock
    ];

    /**
     * @constructor
     * @param {string} name - game event name.
     * @param {string} key - selection key.
     */
    constructor(name, key) {
        super(name, 'name');
        this.key = key;
    }

    /**
     * Check if the specified key matches this game key.
     * @param {string} keyName - key
     * @returns true if matches, otherwise false
     */
    matches(keyName) {
        return keyName.toLowerCase() === this.key;
    }

    /**
     * Process a keyboard event.
     * @param {KeyboardEvent} event - @see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent}
     * @returns {GameKey} game key
     */
    static keyEvent(event) {
        const keyName = event.key.toLowerCase();
        let gameKey = GameKey.Ignore;

        if (event.altKey) {
            switch (keyName) {
                case GameKey.NewGame.key:   // new game
                    gameKey = GameKey.NewGame;
                    break;
                default:
            }
        } else {
            let key = GameKey.SelectionKeys.find(k => k.key === keyName);
            if (key) {
                gameKey = key;
            }
        }
            
        return gameKey;
    }

    /**
     * String representation of object.
     * @returns {string} string of form '<Class name>.<object name>'
     */
    toString() {
        return super.toString(GameKey);
    }
}

/**
 * Enum representing all possible game selections.
 */
 export class Selection extends Enum {
    // freeze selections so can't be modified
    static None = Object.freeze(new Selection('None'));     // no selection
    static Random = Object.freeze(new Selection('Random', GameKey.Random)); // random selection
    static Rock = Object.freeze(new Selection('Rock', GameKey.Rock));
    static Paper = Object.freeze(new Selection('Paper', GameKey.Paper));
    static Scissors = Object.freeze(new Selection('Scissors', GameKey.Scissors));
    static Lizard = Object.freeze(new Selection('Lizard', GameKey.Lizard));
    static Spock = Object.freeze(new Selection('Spock', GameKey.Spock));
    static Spiderman = Object.freeze(new Selection('Spiderman', GameKey.Spiderman));
    static Batman = Object.freeze(new Selection('Batman', GameKey.Batman));
    static Wizard = Object.freeze(new Selection('Wizard', GameKey.Wizard));
    static Glock = Object.freeze(new Selection('Glock', GameKey.Glock));

    key;    // key associated with selection 

    /**
     * @constructor
     * @param {string} name - selection name.
     * @param {GameKey} key - selection game key.
     */
    constructor(name, key) {
        super(name);
        this.key = key;
    }

    /**
     * String representation of object.
     * @returns {string} string of form '<Class name>.<object name>'
     */
    toString() {
        return super.toString(Selection);
    }

    /**
     * Get a finder function suitable for use in Array.find() to match a Selection.
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
 * Enum representing game events.
 */
 export class GameEvent extends Enum {
    // freeze game events so can't be modified
    static GameStart = Object.freeze(new GameEvent('GameStart'));
    static GameEnd = Object.freeze(new GameEvent('GameEnd'));
    static RoundStart = Object.freeze(new GameEvent('RoundStart'));
    static RoundSelections = Object.freeze(new GameEvent('RoundSelections'));
    static RoundEvaluation = Object.freeze(new GameEvent('RoundEvaluation'));
    static RoundProcessed = Object.freeze(new GameEvent('RoundProcessed'));
  
    /**
     * @constructor
     * @param {string} name - game event name.
     */
    constructor(name) {
        super(name, 'name');
    }

    /**
     * String representation of object.
     * @returns {string} string of form '<Class name>.<object name>'
     */
    toString() {
        return super.toString(GameEvent);
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
