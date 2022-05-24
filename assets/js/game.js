import { variableCheck, requiredVariable } from './utils.js';

/**
 * Class representing a player.
 */
 export class Player {

    name;               // player name
    isRobot = false;    // is a robot flag

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

    get name() {
        return super.name;
    }
}

// Enum classes based on examples from https://masteringjs.io/tutorials/fundamentals/enum

/**
 * Enum representing all possible game selections.
 */
 export class Selection {
    // freeze selections so can't be modified
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
 * Enum representing all possible game variants.
 */
 export class GameVariant {
    // freeze variants so can't be modified
    static Basic = Object.freeze(new GameVariant('BigBang'));
    static BigBang = Object.freeze(new GameVariant('BigBang'));
    static Xtreme = Object.freeze(new GameVariant('Xtreme'));
  
    /**
     * @constructor
     * @param {string} name - variant name.
     */
    constructor(name) {
        this.name = name;
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
