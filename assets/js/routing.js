/**
    Application views routing functions.
    @author Ian Buttimer
*/
import { 
    ROOT_URL, BASIC_URL, BIGBANG_URL, XTREME_URL, PLAY_URL, ROUND_RESULT_URL,
    log
} from './globals.js';
import { Enum } from './enums.js'
import { 
    gameSelectMenu, setMenuHandler, gameParamsView, setParamsHandler,
    gamePlayView, setPlayHandler, roundResultView, setRoundResultHandler
} from './views/index.js'
import { savePreferences } from './utils/index.js'

/**
 * Enum representing views.
 */
 export class View extends Enum {
    // freeze views so can't be modified
    /** All active players, play again */
    static GameMenu = Object.freeze(new View('GameMenu'));
    static BasicGame = Object.freeze(new View('BasicGame'));
    static BigBangGame = Object.freeze(new View('BigBangGame'));
    static XtremeGame = Object.freeze(new View('XtremeGame'));
    static Play = Object.freeze(new View('Play'));
    static RoundResult = Object.freeze(new View('RoundResult'));
  
    /**
     * @constructor
     * @param {string} name - view name.
     */
    constructor(name) {
        super(name, 'name');
    }

    /**
     * String representation of object.
     * @returns {string} string of form '<Class name>.<object name>'
     */
    toString() {
        return super.toString(GameMenu);
    }
}

/** Application routes */
const routes = new Map([
    [ROOT_URL, View.GameMenu],
    [BASIC_URL, View.BasicGame],
    [BIGBANG_URL, View.BigBangGame],
    [XTREME_URL, View.XtremeGame],
    [PLAY_URL, View.Play],
    [ROUND_RESULT_URL, View.RoundResult],
]);

/**
 * Set the current view
 * @param {View|string} view - view to set or url
 * @param {GameState} gameState - game state object
 */
export function setView(view, gameState) {
    let innerHTML;
    let setClickHandler;

    if (typeof view === 'string') {
        for (const [url, urlView] of routes.entries()) {
            if (url === view) {
                view = urlView;
                break;
            }
        }
    }
    switch (view) {
        case View.GameMenu:
            innerHTML = gameSelectMenu();
            setClickHandler = setMenuHandler;
            break;
        case View.BasicGame:
        case View.BigBangGame:
        case View.XtremeGame:
            innerHTML = gameParamsView(gameState);
            setClickHandler = setParamsHandler;
            break;
        case View.Play:
            innerHTML = gamePlayView(gameState);
            setClickHandler = setPlayHandler;
            break;
        case View.RoundResult:
            innerHTML = roundResultView(gameState);
            setClickHandler = setRoundResultHandler;
            break;
        default:
            throw new Error(`Unknown view: ${view}`);
    }

    // set view html
    const mainElement = document.getElementById('main');
    mainElement.innerHTML = innerHTML;

    // add handlers
    if (setClickHandler) {
        setClickHandler(gameState);
    }
    addMenuEventHandlers(gameState);
}

/**
 * Add menu event handlers
 * @param {GameState} gameState - current game state
 */
function addMenuEventHandlers(gameState) {

    const menu = document.getElementById("menu-list");
    const sound = document.getElementById("checkbox-sound");
    const animation = document.getElementById("checkbox-animation");

    // Add handler to set initial state of toggle switches
    menu.addEventListener("mouseover", function( event ) {
        if (event.target.id === "menu-settings-dropdown") {
            sound.checked = gameState.soundEnabled;
            animation.checked = gameState.animationEnabled;
        }
    }, false);

    sound.addEventListener("change", function( event ) {
        gameState.soundEnabled = event.target.checked;
        savePreferences(gameState);
        log(`Sound enabled ${gameState.soundEnabled}`);
    }, false);

    animation.addEventListener("change", function( event ) {
        gameState.animationEnabled = event.target.checked;
        savePreferences(gameState);
        log(`Animation enabled ${gameState.animationEnabled}`);
    }, false);
}