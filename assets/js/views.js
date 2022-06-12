/**
    Application views routing functions.
    @author Ian Buttimer
*/
import { 
    ROOT_URL, BASIC_URL, BIGBANG_URL, XTREME_URL, PLAY_URL, ROUND_RESULT_URL
} from './globals.js';
import { Enum } from './enums.js'
import { 
    getGameSelectMenu, setMenuHandler, getGameParams, setParamsHandler,
    getGamePlayView, setPlayHandler, getRoundResultView, setRoundResultHandler
} from './components/index.js'

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
            innerHTML = getGameSelectMenu();
            setClickHandler = setMenuHandler;
            break;
        case View.BasicGame:
        case View.BigBangGame:
        case View.XtremeGame:
            innerHTML = getGameParams(gameState);
            setClickHandler = setParamsHandler;
            break;
        case View.Play:
            innerHTML = getGamePlayView(gameState);
            setClickHandler = setPlayHandler;
            break;
        case View.RoundResult:
            innerHTML = getRoundResultView(gameState);
            setClickHandler = setRoundResultHandler;
            break;
        default:
            throw new Error(`Unknown view: ${view}`);
    }

    // set view html
    let mainElement = document.getElementById('main');
    mainElement.innerHTML = innerHTML;

    // add handlers
    if (setClickHandler) {
        setClickHandler(gameState);
    }
}
