/**
    Player functions and classes.
    @author Ian Buttimer
*/
import { Selection, GameMode } from './enums.js'
import { variableCheck, requiredVariable } from './utils.js';

/**
 * Class representing a player.
 */
 export class Player {

    name;       // player name
    isRobot;    // is a robot flag
    inGame;     // is a game flag
    selection;  // current selection

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
     * @param {Selection} selection - selected selection
     * @param {GameMode} mode - game mode of game
     * @param {GameVariant} variant - game variant
     */
    setSelection(selection, mode = GameMode.Live, variant = null) {
        // sanity checks
        requiredVariable(selection, 'selection');
        requiredVariable(mode, 'mode');
        // player's selection will always be set irrespective of game mode
        this.selection = selection;
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

    /** Get name */
    get name() {
        return super.name;
    }

    /** Get isRobot */
    get isRobot() {
        return super.isRobot;
    }

    /** Get inGame */
    get inGame() {
        return super.inGame;
    }

    /** Get current selection */
    get selection() {
        return super.selection;
    }

    /**
     * Set inGame
     * @param {boolean} playing - currently playing flag
     */
    set inGame(playing) {
        super.inGame = playing;
    }

    /**
     * Set the robot's selection
     * @param {GameVariant} variant - game variant to make selection from
     * @param {GameMode} mode - game mode of game
     * @param {Selection} selection - selected selection
     */
     setSelection(selection = Selection.None, mode = GameMode.Live, variant) {
        // sanity checks
        requiredVariable(variant, 'variant');
        requiredVariable(mode, 'mode');
        // robot's selection will be set in test & demo mode's and random in live
        if (mode === GameMode.Live) {
            this.selection = variant.randomSelection();
        } else {
            this.selection = selection;
        }
    }

    /**
     * Set current selection
     * @param {Selection} selection - current selection
     */
     set selection(selection) {
        super.selection = selection;
    }
}

/* Jasmine requires a default export */
export default 'player.js'
