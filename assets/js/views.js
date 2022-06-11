import { 
    ROOT_URL, BASIC_URL, BIGBANG_URL, XTREME_URL
} from './globals.js';
import { Enum } from './enums.js'
import { getGameSelectMenu, setMenuHandler } from './components/index.js'

/**
 * Enum representing views.
 */
 export class View extends Enum {
    // freeze views so can't be modified
    /** All active players, play again */
    static GameMenu = Object.freeze(new View('GameMenu'));
  
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
    [ROOT_URL, View.GameMenu]
]);

/**
 * Set the current view
 * @param {View} view - view to set
 * @param {Game} game - game object
 */
export function setView(view, game) {
    let innerHTML;
    let setClickHandler;
    switch (view) {
        case View.GameMenu:
            innerHTML = getGameSelectMenu();
            setClickHandler = setMenuHandler;
            break;
        default:
            throw new Error(`Unknown view: ${view}`);
    }

    // set view html
    let myElement = document.getElementById('main');
    myElement.innerHTML = innerHTML;

    // add handlers
    if (setClickHandler) {
        setClickHandler(game);
    }
}
