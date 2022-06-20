/**
    Application views routing functions.
    @author Ian Buttimer
*/
import { 
    ROOT_URL, BASIC_URL, BIGBANG_URL, XTREME_URL, PLAY_URL, ROUND_RESULT_URL,
    RULES_URL, log
} from './globals.js';
import { Enum } from './enums.js'
import { 
    gameSelectMenu, setMenuHandler, gameParamsView, setParamsHandler,
    gamePlayView, setPlayHandler, roundResultView, setRoundResultHandler,
    rulesView, setRulesHandler
} from './views/index.js'
import { htmlP, savePreferences } from './utils/index.js'
import { showYesNoModal, MODAL_YES } from './components/index.js'
import { GameVariant } from './game.js'

/** Menu handler event listeners added flag */
let addedMenuEventHandlers = false;

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
    static Rules = Object.freeze(new View('Rules'));
  
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
        return super.toString(View);
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
    [RULES_URL, View.Rules]
]);

/**
 * Set the current view
 * @param {View|string} view - view to set or url
 * @param {GameState} gameState - game state object
 */
export function setView(view, gameState) {
    let innerHTML;
    let setClickHandler;
    let process = true;

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
        case View.Rules:
            if (gameState.isMatchInProgress) {
                // confirm abort of current game
                gameState.pauseMatch();
                showYesNoModal('confirm new game', 
                                htmlP([], 'This will end the current game. Do you want to continue?'), 
                                checkChoice,
                                { view: view, gameState: gameState });
                process = false;    // wait for user response
            }
            break;
        default:
            // ok to process
    }

    if (process) {
        switch (view) {
            case View.GameMenu:
                innerHTML = gameSelectMenu();
                setClickHandler = setMenuHandler;
                break;
            case View.BasicGame:
            case View.BigBangGame:
            case View.XtremeGame:
                gameState.game.variant = (view === View.BasicGame ? GameVariant.Basic :
                    (view === View.BigBangGame ? GameVariant.BigBang : GameVariant.Xtreme));

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
            case View.Rules:
                innerHTML = rulesView(gameState);
                setClickHandler = setRulesHandler;
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
        if (!addedMenuEventHandlers) {
            addMenuEventHandlers(gameState);
        }
    }
}

/**
 * Handle confirm game abort dialog choice
 * @param {string} choice - value for button clicked on modal
 * @param {object} context - current game state 
 */
function checkChoice(choice, context) {
    if (choice === MODAL_YES) {
        // end game and set required view
        context.gameState.endMatch();
        setView(context.view, context.gameState);
    } else {
        context.gameState.unPauseMatch();
    }
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

    // Add toggle switches change handlers
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

    // Add menu item click handler
    ["menu-logo", "menu-rules"].forEach(id => {
        document.getElementById(id).addEventListener("click", function( event ) {
            setView(event.target.value, gameState);
        }, false);
    })

    addedMenuEventHandlers = true;
}