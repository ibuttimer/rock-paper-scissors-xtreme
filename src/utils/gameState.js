import { DEFAULT_PLAYERS, DEFAULT_ROBOTS, DEFAULT_GAMES } from '../Globals.js'
import { Game, GameVariant } from '../services/index.js'

/**
 * Class representing the game state
 */
export default class GameState {

    game;           // game object
    bestOf;         // max number of games to play
    currentGame;    // current game number

    /**
     * @constructor
     * @param {Game} game - game object
     * @param {number} bestOf - max number of games to play
     */
     constructor(game, bestOf = DEFAULT_GAMES) {
        if (!(game instanceof Game)) {
            game = new Game(GameVariant.Basic, DEFAULT_PLAYERS, DEFAULT_ROBOTS)
        }
        this.game = game;
        this.bestOf = bestOf;
        this.currentGame = 0;
    }

    /**
     * String representation of object.
     * @returns {string}
     */
     toString() {
        return `{${this.game}, ${this.currentGame} of ${this.bestOf}}`;
    }
}