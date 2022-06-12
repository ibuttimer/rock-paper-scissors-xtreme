/**
    Game state class.
    @author Ian Buttimer
*/
import { 
    DEFAULT_PLAYERS, DEFAULT_ROBOTS, DEFAULT_GAMES, IMG_ASSETS_BASE_URL, ROOT_URL, PLAY_URL
} from './globals.js'
import { Game, GameVariant } from './game.js'
import { Enum, GameKey, Selection, GameMode, GameStatus, GameEvent, ResultCode } from './enums.js';
import { setView } from './routing.js'

/**
 * Generate a selection tile parameters object
 * @param {string} src - image source
 * @param {string} alt - image alt text
 * @param {Selection} selection - selection
 * @returns {object} selection tile parameters
 */
 function selectionTileParams(src, alt, selection) {
    return {
        src: src, 
        alt: alt, 
        selection: selection
    }
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
    SELECTIONS.set(entry[0], 
        selectionTileParams(`${IMG_ASSETS_BASE_URL}${entry[1]}`, `${entry[0].name} selection.`, entry[0])));

/**
 * Class representing the game state
 */
export default class GameState {

    /** Game object 
     * @type {Game} */
    game;
    /** Max number of games to play 
     * @type {number} */
    bestOf;
    /** Current game number 
     * @type {number} */
    currentGame;
    /** Map of scores with players as key
     * @type {Map} */
    scores;
    /** Current round result 
     * @type {GameResult} */
    roundResult;
    /**
     * Function with the following signature:
     *  callback(gameState: GameState, eventResult: PlayEventResult)
     * to be called back following player selection
     * @type {function}
     */
    selectionHandledCallback;

    static beep = new Audio('assets/audio/beep-10.mp3');

    /**
     * @constructor
     * @param {Game} game - game object; if not provided 'numPlayers', 'numRobots' & 'options' are used to create a Basic game.
     * @param {number} bestOf - max number of games to play; default {@link DEFAULT_GAMES}
     * @param {number} numPlayers - number of players; default {@link DEFAULT_PLAYERS}
     * @param {number} numRobots - number of robots; default {@link DEFAULT_ROBOTS}
     * @param {number} options - OR bitmask of OPTxxx; default {@link Game.OPT_NONE}
     */
    constructor(game, bestOf = DEFAULT_GAMES, numPlayers = DEFAULT_PLAYERS, numRobots = DEFAULT_ROBOTS, options = Game.OPT_NONE) {
        if (!(game instanceof Game)) {
            game = new Game(GameVariant.Basic, numPlayers, numRobots, options);
        }
        this.game = game;
        this.bestOf = bestOf;
        this.currentGame = 0;
        this.scores = new Map();
        this.roundResult = null;
        this.selectionHandledCallback = null;
    }

    /** Start the game */
    startGame() {
        this.scores.clear();
        this.game.players.forEach(player => this.scores.set(player, 0));

        this.currentGame = 1;

        // game play using events
        this.game.playGameEvents();

        // add key listener
        document.addEventListener('keydown', this, false);
    }

    /** Reset the game */
    resetGame(numPlayers = DEFAULT_PLAYERS, numRobots = DEFAULT_ROBOTS, bestOf = DEFAULT_GAMES) {
        this.game.variant = GameVariant.Basic;
        this.game.init(numPlayers, numRobots);

        this.bestOf = bestOf;
        this.currentGame = 0;
        this.scores.clear();
        this.roundResult = null;
        this.selectionHandledCallback = null;

        // remove key listener
        document.removeEventListener('keydown', this, false);
    }

    /**
     * Handle selection made by player
     * @param {Selection|GameKey|string} selection - Selection or key associated with selection
     */
    handleSelection(selection) {
        // @type {PlayEventResult} event result object
        const eventResult = this.game.makePlayEvent(selection);

        if (!eventResult.roundInProgress) {
            // round finished
            const gameResult = eventResult.gameResult;
            this.roundResult = gameResult;

            switch (gameResult.resultCode) {
                case ResultCode.Winner:
                    // update score
                    let player = gameResult.data;
                    this.incPlayerScore(player);

                    // check if best of winner
                    const bestOfWinner = this.haveBestOfWinner();
                    if (bestOfWinner.soleWinner) {
                        // single winner, match over
                        gameResult.resultCode = ResultCode.MatchOver;
                    } else if (bestOfWinner.multiWinner) {
                        throw new Error(`Unexpected multi-winner: ${bestOfWinner.count}`);
                    }
                    break;
                default:
                    break;
            }
        }
        // do callback
        if (this.selectionHandledCallback) {
            this.selectionHandledCallback(this, eventResult);
        }
    }

    /**
     * Keyboard event listener
     * @param {KeyboardEvent} event - @see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent}
     */
     handleEvent(event) {
        // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
        const key = GameKey.keyEvent(event);
        let invalid = false;

        if (key === GameKey.NewGame) {
            // abort current game and start again
            this.resetGame();
            setView(ROOT_URL, this);
        } else if (key === GameKey.Next) {
            // next round/game or finish game, if round not in progress
            invalid = this.game.roundInProgress;
            if (!invalid) {
                this.handleRoundResult();
            }
        } else if (this.game.roundInProgress && this.game.variant.isValidKey(key)) {
            this.handleSelection(key);
        } else {
            invalid = true;
        }

        if (invalid) {
            GameState.beep.play();
        }
    }

    /**
     * Handle round result
     */
     handleRoundResult() {
        let url = PLAY_URL; // default url to continue
        const resultCode = this.roundResult.resultCode;

        switch (resultCode) {
            case ResultCode.Eliminate:
            case ResultCode.PlayAgain:
                this.nextRound();
                break;
            case ResultCode.Winner:
                this.nextGame();
                break;
            case ResultCode.MatchOver:
                this.resetGame();
                url = ROOT_URL;
                break;
            default:
                throw new Error(`Unknown ResultCode: ${resultCode}`);
        }
        setView(url, this);
    }

    /** Next round */
    nextRound() {
        this.game.startRound();
    }

    /** Next game */
    nextGame() {
        this.currentGame++;

        // game play using events
        this.game.playGameEvents();
    }

    /** Current player's name */
    get currentPlayerName() {
        return this.game.currentPlayer.name;
    }

    /**
     * Set a player's score
     * @param {Player} player - player whose score to set
     * @param {number} score - score to set
     */
    setPlayerScore(player, score) {
        this.scores.set(player, score);
    }

    /**
     * Get a player's score
     * @param {Player} player - player whose score to get
     * @returns {number} score
     */
    getPlayerScore(player) {
        return this.scores.get(player);
    }

    /**
     * Update a player's score
     * @param {Player} player - player whose score to update
     * @param {number} update - amount to update by
     */
    updatePlayerScore(player, update = 0) {
        this.setPlayerScore(player, this.getPlayerScore(player) + update);
    }

    /**
     * Increment a player's score
     * @param {Player} player - player whose score to increment
     */
    incPlayerScore(player) {
        this.updatePlayerScore(player, 1);
    }

    /**
     * Get player scores in descending order
     * @returns {Array} object with
     * @type {Player} player - player object
     * @type {number} score - player's score
     */
    get topDownScores() {
        const playerScores = this.game.players.map(player => {
            return {
                player: player,
                score: this.scores.get(player)
            }
        });
        return playerScores.sort((a, b) => b.score - a.score);
    }

    /**
     * Check if there is a 'best of' winner
     * @returns {object} 
     */
    haveBestOfWinner() {
        const playerScores = this.topDownScores;
        const toWinScore = Math.floor(this.bestOf / 2) + 1;
        const haveScore = playerScores.filter(ps => ps.score >= toWinScore);
        return {
            soleWinner: haveScore.length === 1,     // single winner flag
            multiWinner: haveScore.length > 1,      // multiple winners flag
            count: haveScore.length,                // number of winners
            solePlayer: haveScore.length === 1 ? haveScore[0].player : undefined,           // winning player if single winner
            multiPlayer: haveScore.length > 1 ? haveScore.map(x => x.player) : undefined    // winning players if more than 1 winner
        };
    }

    /**
     * All possible selections for game variant
     * @returns {Array[object]} array of {@link selectionTileParams}
     */
    get selections() {
        return this.game.variant.possibleSelections.map(sel => SELECTIONS.get(sel));
    }

    /**
     * Get the game progress map
     * @returns {Map} progress map 
     * @type {string} key - name
     * @type {number} value - value
     */
    get progressMap() {
        return new Map(
            [['Best of', this.bestOf], ['Game', this.currentGame], ['Round', this.game.roundNumber]]
        );
    }

    /**
     * String representation of object.
     * @returns {string}
     */
     toString() {
        return `{${this.game}, ${this.currentGame} of ${this.bestOf}}`;
    }
}