/**
    Application entry point script.
    @author Ian Buttimer
*/
import { DEFAULT_PLAYERS, DEFAULT_ROBOTS } from './globals.js';
import { 
    default as config, VARIANT_KEY, NUM_PLAYERS_KEY, NUM_ROBOTS_KEY, 
    NUM_GAMES_KEY, MODE_KEY, VIEW_KEY, INPUT_KEY, ALL_KEYS,
    PARAMS_VIEW, PLAY_VIEW, CONTROL_VIEW, RULES_VIEW
} from "../../env.js";
import { log } from './utils/index.js';
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

    // load variant & mode from local storage
    const variant = loadVariant();
    const mode = loadMode();

    // load number of players/robots from local storage
    const numPlayers = getNumber(NUM_PLAYERS_KEY, DEFAULT_PLAYERS);
    const numRobots = getNumber(NUM_ROBOTS_KEY, DEFAULT_ROBOTS);

    gameState = new GameState(
        new Game(variant, numPlayers, numRobots, config.ENABLE_LOG ? Game.OPT_CONSOLE: Game.OPT_NONE)
    )

    // load number of games from local storage
    gameState.bestOf = getNumber(NUM_GAMES_KEY, gameState.bestOf);

    let view = localStorage.getItem(VIEW_KEY);
    if (view) {
        view = view.toLowerCase();
        switch (view) {
            case PARAMS_VIEW:
                // display params screen
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
            case PLAY_VIEW:
            case CONTROL_VIEW:
                gameState.game.setGameMode(mode);
                setParamsOverride(numPlayers, numRobots, gameState.bestOf, mode);
                playGame({}, gameState, view === PLAY_VIEW);    // set view in playGame for PLAY_VIEW

                if (view === CONTROL_VIEW) {

                    gameState.selectionHandledCallback = (gameState, eventResult) => {
                        // TODO support more than 1 round of play
                        if (!eventResult.roundInProgress) {
                            // round finished
                            setView(View.RoundResult, gameState);
                        }
                    }
    
                    // process input
                    const input = localStorage.getItem(INPUT_KEY);
                    if (input) {
                        input.split(',').forEach(key => {
                            // fake key down event
                            gameState.handleEvent(fakeKeyEvent(key));
                        });
                    }
                }
                view = undefined;
                break;
            case RULES_VIEW:
                view = View.Rules;
                break;
            default:
                view = View.GameMenu;
                break;
        }
    } else {
        view = View.Landing;
    }

    if (view){
        setView(view, gameState);
    }

    // clear local storage overrides for pristine start next time
    ALL_KEYS.forEach(key => localStorage.removeItem(key));
}

/**
 * Get game variant from local storage
 * @returns {GameVariant}
 */
function loadVariant() {
    // load variant from local storage
    return loadEnum(VARIANT_KEY, GameVariant.AllVariants, GameVariant.Basic, 'variant');
}

/**
 * Load an {@link Enum} setting from local storage
 * @param {string} key - local storage key
 * @param {Array[Enum]} possibilities - Array of possible values
 * @param {Enum} defaultValue - default value
 * @param {string} name - setting name
 * @returns {Enum}
 */
function loadEnum(key, possibilities, defaultValue, name) {
    // load variant from local storage
    let value = undefined;
    let storage = localStorage.getItem(key);
    if (typeof storage === 'string') {
        storage = storage.toLowerCase();
        for (let entry of possibilities ) {
            if (storage === entry.name.toLowerCase()) {
                value = entry;
                break;
            }
        }
        if (!value) {
            throw new Error(`Unknown ${name} setting: ${storage}`);
        }
    } else {
        value = defaultValue;
    }
    return value;
}

/**
 * Get game mode from local storage
 * @returns {GameMode}
 */
 function loadMode() {
    return loadEnum(MODE_KEY, GameMode.AllModes, GameMode.Live, 'game mode');
}

/**
 * Get a number from local storage
 * @param {string} key - localStorage key
 * @param {number} defaultValue - default value if not found
 */
function getNumber(key, defaultValue) {
    let num = loadStorageInteger(key);
    if (Number.isNaN(num)) {
        num = defaultValue;
    }
    return num;
}


const ESC_KEY = 'esc';
const ALT_KEY = 'alt';
const CTRL_KEY = 'ctrl';
const META_KEY = 'meta';
const SHIFT_KEY = 'shift';
const modKeys = new Map([
    [ESC_KEY, "Escape"], [ALT_KEY, "Alt"], [CTRL_KEY, "Control"], [META_KEY, "Meta"], [SHIFT_KEY, "Shift"]
]);

/**
 * Generate an object simulating a keyboard event
 * @param {string} key - key
 * @returns {object}
 */
function fakeKeyEvent(key) {
    let altKey = false;
    let ctrlKey = false;
    let metaKey = false;
    let shiftKey = false;

    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
    // "Alt", "AltGraph", "Control", "Meta", "Shift", "Esc", "Escape"
    let modOnly = modKeys.get(key.toLowerCase());
    if (modOnly) {
        key = modOnly;
    } else {
        // check for modified key; {ctrl/alt/shift}+{key}
        const modifier = key.match(/([A-Za-z]+)\+([A-Za-z]{1})/);
        if (modifier) {
            modOnly = modifier[1].toLowerCase();
            key = modifier[2];
        }
    }
    switch (modOnly) {
        case ALT_KEY:
            altKey = true;
            break;
        case CTRL_KEY:
            ctrlKey = true;
            break;
        case META_KEY:
            metaKey = true;
            break;
        case SHIFT_KEY:
            shiftKey = true;
            break;
        default:
            break;
    }

    return {
            type: 'keydown',
            altKey: altKey,
            ctrlKey: ctrlKey,
            isComposing: false,
            key: key,
            metaKey: metaKey,
            repeat: false,
            shiftKey: shiftKey
        };
}