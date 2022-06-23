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

// html ids of elements
const mainElementId = 'main';
const logoElementId = 'menu-logo';
const animationSettingElementId = 'animation-toggle-control';
const soundSettingElementId = 'sound-toggle-control';

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
        let logoAriaLabel = 'logo goto home page.';

        switch (view) {
            case View.GameMenu:
                innerHTML = gameSelectMenu();
                setClickHandler = setMenuHandler;
                logoAriaLabel = 'logo, current page, home.';
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
        const mainElement = document.getElementById(mainElementId);
        mainElement.innerHTML = innerHTML;

        // set aria-label for logo
        const logoElement = document.getElementById(logoElementId);
        logoElement.setAttribute('aria-label', logoAriaLabel);

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
        // reset game and set required view
        context.gameState.resetMatch();
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
        handleSettingChange(gameState, 'soundEnabled', event.target.checked);
    }, false);

    animation.addEventListener("change", function( event ) {
        handleSettingChange(gameState, 'animationEnabled', event.target.checked);
    }, false);

    // Add menu item click handler
    ["menu-logo", "menu-rules"].forEach(id => {
        document.getElementById(id).addEventListener("click", function( event ) {
            const value = event.target.value ? event.target.value : event.currentTarget.value;
            setView(value, gameState);
        }, false);
    })

    addedMenuEventHandlers = true;
}

/**
 * Handle a setting change
 * @param {GameState} gameState - current game state
 * @param {string} setting - setting attribute
 * @param {boolean} enabled - new setting value
 */
function handleSettingChange(gameState, setting, enabled) {
    gameState[setting] = enabled;
    savePreferences(gameState);
    setSettingsAriaLabel(gameState);
    log(`${setting}: ${gameState[setting]}`);
}

/**
 * Set the aria labels for the settings menu
 * @param {GameState} gameState - current game state
 */
export function setSettingsAriaLabel(gameState) {
    [animationSettingElementId, soundSettingElementId].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            let value;
            let setting;
            switch (id) {
                case animationSettingElementId:
                    value = gameState.animationEnabled;
                    setting = 'animation';
                    break;
                case soundSettingElementId:
                    value = gameState.soundEnabled;
                    setting = 'sound';
                    break;
                default:
                    throw new Error(`Unknown setting id: ${id}`);
            }
            element.setAttribute('aria-label', `${setting} ${value ? 'enabled' : 'disabled'}`);
        }
    });
}