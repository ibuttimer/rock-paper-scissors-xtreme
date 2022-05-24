/**
    Player functions and classes.
    @author Ian Buttimer
*/
import { Selection } from './game.js'
import { variableCheck } from './utils.js';

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
        this.isRobot = false;
        this.inGame = false;
        this.selection = Selection.None;

        ++Player.#playerCount;
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
        this.isRobot = true;

        ++Robot.#robotCount;
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
     * Set current selection
     * @param {Selection} selection - current selection
     */
     set selection(selection) {
        super.selection = selection;
    }
}

/* Jasmine requires a default export */
export default 'player.js'
