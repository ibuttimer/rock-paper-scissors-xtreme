/**
    Application views routing functions.
    @author Ian Buttimer
*/
import { 
    ROOT_URL, GAME_URL, BASIC_URL, BIGBANG_URL, XTREME_URL, PLAY_URL, 
    ROUND_RESULT_URL, RULES_URL,
    SOUND_PROPERTY, ANIMATION_PROPERTY, LANDING_PROPERTY
} from './globals.js';
import { default as config } from '../../env.js'
import { Enum } from './enums.js'
import { 
    landingPage, setLandingHandler, gameSelectMenu, setMenuHandler, 
    gameParamsView, setParamsHandler, gamePlayView, setPlayHandler, 
    roundResultView, setRoundResultHandler, rulesView, setRulesHandler
} from './views/index.js'
import { htmlP, savePreferences, log } from './utils/index.js'
import { showYesNoModal, MODAL_YES } from './components/index.js'
import { GameVariant } from './game.js'

/** Menu handler event listeners added flag */
let addedMenuEventHandlers = false;

// html ids of elements
const mainElementId = 'main';
const logoElementId = 'menu-logo';
const rulesElementId = 'menu-rules';
const settingsElementId = 'menu-settings';
const hamburgerElementId = 'menu-hamburger';
const hamburgerImgId = 'menu-hamburger-img';
const rulesMenuId = 'menu-rules-div';
const settingsMenuId = 'menu-settings-dropdown';
const animationSettingElementId = 'animation-toggle-control';
const soundSettingElementId = 'sound-toggle-control';
const landingSettingElementId = 'landing-toggle-control';
const hamburgerOpen = "open";
const hamburgerClosed = "closed";

/**
 * Setting parameter object
 * @param {string} property - GameState property name
 * @param {string} setting - name for ariaLabel
 * @param {string} checkbox - settings checkbox element id
 * @returns {object}
 */
const propertySetting = (property, setting, checkbox) => {
    return { property: property, setting: setting, checkbox: checkbox };
};
/** 
 * Map of settings
 * @type {string} key - toggle switch element id
 * @type {object} value - setting parameter object @see {@link propertySetting}
 */
const settingSwitches = new Map([
    [soundSettingElementId, propertySetting(SOUND_PROPERTY, 'sound', 'checkbox-sound')],
    [animationSettingElementId, propertySetting(ANIMATION_PROPERTY, 'animation', 'checkbox-animation')],
    [landingSettingElementId, propertySetting(LANDING_PROPERTY, 'start page', 'checkbox-landing')]
]);

/**
 * Enum representing views.
 */
 export class View extends Enum {
    // freeze views so can't be modified
    /** All active players, play again */
    static Landing = Object.freeze(new View('Landing'));
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
    [ROOT_URL, View.Landing],
    [GAME_URL, View.GameMenu],
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

    if (view === View.Landing && !gameState.displayLanding) {
        view = View.GameMenu;   // don't display landing, go straight to game selection
    }

    switch (view) {
        case View.Landing:
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
        let page;
        let toHome = 'goto';    // default navigate to home

        switch (view) {
            case View.Landing:
                innerHTML = landingPage();
                setClickHandler = setLandingHandler;
                page = 'current';
                toHome = '';
                break;
            case View.GameMenu:
                innerHTML = gameSelectMenu();
                setClickHandler = setMenuHandler;
                page = 'game selection';
                break;
            case View.BasicGame:
            case View.BigBangGame:
            case View.XtremeGame:
                if (view === View.BasicGame) {
                    gameState.game.variant = GameVariant.Basic;        
                    page = 'basic';
                } else if (view === View.BigBangGame) {
                    gameState.game.variant = GameVariant.BigBang;        
                    page = 'big bang';
                } else {
                    gameState.game.variant = GameVariant.Xtreme;        
                    page = 'extreme';
                }

                innerHTML = gameParamsView(gameState);
                setClickHandler = setParamsHandler;
                page = `${page} game parameters`;
                break;
            case View.Play:
                innerHTML = gamePlayView(gameState);
                setClickHandler = setPlayHandler;
                page = 'play';
                break;
            case View.RoundResult:
                innerHTML = roundResultView(gameState);
                setClickHandler = setRoundResultHandler;
                page = 'results';
                break;
            case View.Rules:
                innerHTML = rulesView(gameState);
                setClickHandler = setRulesHandler;
                page = 'rules';
                break;
            default:
                throw new Error(`Unknown view: ${view}`);
        }

        // set view html
        let element = document.getElementById(mainElementId);
        element.innerHTML = innerHTML;

        // set aria-label for menu items
        element = document.getElementById(logoElementId);
        element.setAttribute('aria-label', `logo, ${page} page, ${toHome} home.`);
        element = document.getElementById(rulesElementId);
        element.setAttribute('aria-label', 
            view === View.Rules ? `current page, rules.` : `goto rules page.`);
    
        displayHamburger(false);

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

    // Set initial display state of toggle switches
    const setInitial = (event) => {
        for (const propSetting of settingSwitches.values()) {
            document.getElementById(propSetting.checkbox).checked = gameState[propSetting.property];
        }
    };

    // Add handlers to set initial state of toggle switches; 
    // mouseover for desktop, click for mobile
    menu.addEventListener("mouseover", function( event ) {
        if (event.target.id === "menu-settings-dropdown") {
            setInitial(event);
        }
    }, false);
    document.getElementById(settingsElementId).addEventListener("click", setInitial, false);

    // Add toggle switches change handlers
    for (const propSetting of settingSwitches.values()) {
        document.getElementById(propSetting.checkbox)
            .addEventListener("change", function( event ) {
                handleSettingChange(gameState, propSetting.property, event.target.checked);
            }, false)
    }
    
    // Add menu item click handler
    [logoElementId, rulesElementId].forEach(id => {
        document.getElementById(id).addEventListener("click", function( event ) {
            const value = event.target.value ? event.target.value : event.currentTarget.value;
            setView(value, gameState);
        }, false);
    })

    // Add hamburger click handler
    document.getElementById(hamburgerElementId).addEventListener("click", function( event ) {
        let value = event.target.value ? event.target.value : event.currentTarget.value;

        displayHamburger(value === hamburgerClosed);   // display if closed, otherwise hide
    }, false);


    var mql = window.matchMedia('(max-width: 370px)');
    mql.addEventListener('change', (event) => {
        /* if the viewport is more than 370 pixels wide, hamburger not displayed, 
            so set value correctly in case window was resized with hamburger open */
        const value = document.getElementById(hamburgerElementId).getAttribute('value');
        if (!event.matches && value === hamburgerOpen) {
            displayHamburger(false);
        }
    });

    addedMenuEventHandlers = true;
}

/**
 * Display the hamburger menu
 * @param {boolean} display - display flag
 */
function displayHamburger(display) {
    [rulesMenuId, settingsMenuId].forEach(id => {
        const element = document.getElementById(id);
        if (display) {
            element.classList.add('div__menu-link-show');
        } else {
            element.classList.remove('div__menu-link-show')
        }
    });

    document.getElementById(hamburgerElementId).setAttribute('value', display ? hamburgerOpen : hamburgerClosed);

    const ariaLabel = `${display ? "close" : "open"} hamburger menu`;
    let element = document.getElementById(hamburgerImgId);
    element.setAttribute('src', `${config.IMG_ASSETS_BASE_URL}${display ? "menu-close.svg" : "menu-open.svg"}`);
    element.setAttribute('alt', ariaLabel);

    document.getElementById(hamburgerElementId).setAttribute('aria-label', ariaLabel);   
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
    for (const [key, propSetting] of settingSwitches.entries()) {
        const element = document.getElementById(key);
        element.setAttribute('aria-label', `${propSetting.setting}`);
        element.setAttribute('aria-checked', `${gameState[propSetting.property] ? 'true' : 'false'}`);
    }
}