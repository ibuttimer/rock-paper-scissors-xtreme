/**
    Player functions and classes.
    @author Ian Buttimer
*/
import { GameKey, Selection, GameMode } from './enums.js'
import { variableCheck, requiredVariable } from './utils/index.js';

/**
 * Class representing a player.
 */
 export class Player {

    /**
     * Player name
     * @type{string} */
    name;
    /**
     * Player is robot flag
     * @type{boolean} */
    isRobot;
    /**
     * Player in game flag
     * @type{boolean} */
    inGame;
    /**
     * Player's current selection
     * @type{Selection} */
    selection;
    /**
     * Player-specific css classes
     * @type{object} - key: css property name, value: css class which sets the property */
    css;
    /**
     * Player-specific colour
     * @type{string} */
    colour;

    static #playerCount = 0;   // private counter for number of Player objects created

    /**
     * @constructor
     * @param {string} name - Player name.
     */
    constructor(name) {
        // sanity checks
        if (!variableCheck(name, 'name')) {
            name = `Player ${Player.#playerCount + 1}`;
        }

        this.name = name;
        this.css = {};
        this.colour = '';
        this.initState();

        ++Player.#playerCount;
    }

    /**
     * Initialise the player state.
     */
    initState() {
        this.isRobot = false;
        this.inGame = false;
        this.selection = Selection.None;
    }

    /**
     * Set the player's selection
     * @param {Selection|GameKey|string} selection - selected selection or associated key
     * @param {GameMode} mode - game mode of game
     * @param {GameVariant} variant - game variant
     * @returns {Selection} if selection was set the Selection, otherwise Selection.None
     */
    setSelection(selection, mode = GameMode.Live, variant) {
        // sanity checks
        requiredVariable(selection, 'selection');
        requiredVariable(mode, 'mode');
        requiredVariable(variant, 'variant');
        // player's selection will always be set irrespective of game mode
        if (typeof selection === 'string' || selection instanceof GameKey) {
            selection = variant.getSelection(selection);
        }

        let selectionSet = Selection.None;
        if (variant.isValidSelection(selection)) {
            this.selection = selection;
            selectionSet = selection;
        }
        return selectionSet;
    }

    /**
     * String representation of object.
     * @returns {string}
     */
     toString() {
        return `{${this.name}, robot:${this.isRobot ? 'Y' : 'N'}, inGame:${this.inGame ? 'Y' : 'N'}, selection:${this.selection}}, colour:${this.colour}}`;
    }
}

/**
 * Class representing a robot.
 */
 export class Robot extends Player {

    static #robotCount = 0;   // private counter for number of Robot objects created

    /**
     * @constructor
     * @param {number} id - robot id number
     */
    constructor(id) {
        // sanity checks
        if (!variableCheck(id, 'id')) {
            id = Robot.#robotCount + 1;
        }

        super(`Robot ${id}`);
        this.initState();

        ++Robot.#robotCount;
    }

    /**
     * Initialise the player state.
     */
    initState() {
        super.initState();
        this.isRobot = true;
    }

    /**
     * Set the robot's selection
     * @param {GameVariant} variant - game variant to make selection from
     * @param {GameMode} mode - game mode of game
     * @param {Selection} selection - selected selection
     * @returns {Selection} if selection was set the Selection, otherwise Selection.None
     */
    setSelection(selection = Selection.None, mode = GameMode.Live, variant) {
        // sanity checks
        requiredVariable(variant, 'variant');
        requiredVariable(mode, 'mode');
        // robot's selection will be set in test & demo mode's and random in live
        let selectionSet;
        if (mode === GameMode.Live) {
            selectionSet = variant.randomSelection();
            this.selection = selectionSet;
        } else {
            selectionSet = super.setSelection(selection, mode, variant);
        }
        return selectionSet;
    }
}

/* Jasmine requires a default export */
export default 'player.js'
