/**
    Application entry point script.
    @author Ian Buttimer
*/
import { log, DEFAULT_PLAYERS, DEFAULT_ROBOTS } from './globals.js';
import { 
    default as config, VARIANT_KEY, NUM_PLAYERS_KEY, NUM_ROBOTS_KEY, 
    NUM_GAMES_KEY, VIEW_KEY 
} from "../../env.js";
import { GameVariant, Game } from './game.js';
import { GameMode } from './enums.js';
import { default as GameState } from './game-state.js';
import { View, setView } from './routing.js'
import { loadStorageInteger } from './utils/index.js'
import { setParamsOverride, playGame } from './views/index.js'

/* Wait for the DOM to finish loading before running the game
    as per Love Maths example project */

document.addEventListener("DOMContentLoaded", function() {
    runGame();
});

let gameState;

/**
 * The main game "loop", called when the script is first loaded
 * and after the user's answer has been processed
 */
function runGame() {

    log('runGame');

    // load variant from local storage
    let variant = localStorage.getItem(VARIANT_KEY);
    if (typeof variant === 'string') {
        variant = variant.toLowerCase();
        if (variant === GameVariant.Basic.name.toLowerCase()) {
            variant = GameVariant.Basic;
        } else if (variant === GameVariant.BigBang.name.toLowerCase()) {
            variant = GameVariant.BigBang;
        } else if (variant === GameVariant.Xtreme.name.toLowerCase()) {
            variant = GameVariant.Xtreme;
        } else {
            throw new Error(`Unknown variant setting: ${variant}`);
        }
    } else {
        variant = GameVariant.Basic;
    }

    // load number of players/robots from local storage
    let numPlayers = loadStorageInteger(NUM_PLAYERS_KEY);
    if (Number.isNaN(numPlayers)) {
        numPlayers = DEFAULT_PLAYERS;
    }
    let numRobots = loadStorageInteger(NUM_ROBOTS_KEY);
    if (Number.isNaN(numRobots)) {
        numRobots = DEFAULT_ROBOTS;
    }

    gameState = new GameState(
        new Game(variant, numPlayers, numRobots, config.ENABLE_LOG ? Game.OPT_CONSOLE: Game.OPT_NONE)
    )

    // load number of games from local storage
    let numGames = loadStorageInteger(NUM_GAMES_KEY);
    if (!Number.isNaN(numGames)) {
        gameState.bestOf = numGames;
    }

    let view = localStorage.getItem(VIEW_KEY);
    if (view) {
        switch (view.toLowerCase()) {
            case 'params':
                switch (variant) {
                    case GameVariant.Basic:
                        view = View.BasicGame;
                        break;
                    case GameVariant.BigBang:
                        view = View.BigBangGame;
                        break;
                    default:
                        view = View.XtremeGame;
                        break;
                }
                break;
            case 'play':
                gameState.game.setGameMode(GameMode.Demo);
                setParamsOverride(numPlayers, numRobots, numGames);
                playGame({}, gameState);
                view = undefined;   // view set in playGame
                break;
            default:
                view = View.GameMenu;
                break;
        }
    } else {
        view = View.GameMenu;
    }

    if (view){
        setView(view, gameState);
    }

    // clear local storage overrides for pristine start next time
    [
        VARIANT_KEY, NUM_PLAYERS_KEY, NUM_ROBOTS_KEY, VIEW_KEY, NUM_GAMES_KEY
    ].forEach(key => localStorage.removeItem(key));
}