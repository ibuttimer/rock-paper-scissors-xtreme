import { DEFAULT_PLAYERS, DEFAULT_ROBOTS, DEFAULT_GAMES } from '../Globals.js'
import { Game, GameVariant, Selection } from '../services/index.js'


/**
 * Generate selection info object
 * @param {string} src - image source
 * @param {string} alt - alt text for image
 * @returns {object}
 */
function selectionInfo(src, alt) {
    return { src: src, alt: alt };
}

// info for all possible selections
const SELECTIONS = new Map();
[
    [Selection.Rock, 'rocks.png'],
    [Selection.Paper, 'paper.png'],
    [Selection.Scissors, 'scissors.png'],
    [Selection.Lizard, 'lizard.png'],
    [Selection.Spock, 'spock.png'],
    [Selection.Spiderman, 'spiderman.png'],
    [Selection.Batman, 'batman.png'],
    [Selection.Wizard, 'wizard.png'],
    [Selection.Glock, 'handgun.png']
].forEach(entry => 
    SELECTIONS.set(entry[0], selectionInfo(`assets/img/${entry[1]}`, `${entry[0].name} selection`)));


/**
 * Class representing the game state
 */
export default class GameState {

    game;           // game object
    bestOf;         // max number of games to play
    currentGame;    // current game number
    scores;         // map of scores
    roundResult;    // current round result

    /**
     * @constructor
     * @param {Game} game - game object
     * @param {number} bestOf - max number of games to play
     */
     constructor(game, bestOf = DEFAULT_GAMES) {
        if (!(game instanceof Game)) {
            game = new Game(GameVariant.Basic, DEFAULT_PLAYERS, DEFAULT_ROBOTS, Game.OPT_CONSOLE)
        }
        this.game = game;
        this.bestOf = bestOf;
        this.currentGame = 0;
        this.scores = new Map();
        this.roundResult = null;
    }

    /** Start the game */
    startGame() {
        this.game.players.forEach(player => this.scores.set(player, 0));

        this.currentGame = 1;

        // game play using events
        this.game.playGameEvents();
    }

    /** Current player's name */
    get currentPlayerName() {
        return this.game.currentPlayer.name;
    }

    /**
     * All possible selections for game variant
     * @returns {Array} array of {
     *      selection: {selection},
     *      src: {image source},
     *      alt: {alt text for image}
     * }
     */
    get selections() {
        return this.game.variant.possibleSelections.map(x => Object.assign({
            selection: x
        }, SELECTIONS.get(x)))
    }

    /**
     * String representation of object.
     * @returns {string}
     */
     toString() {
        return `{${this.game}, ${this.currentGame} of ${this.bestOf}}`;
    }
}