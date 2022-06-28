/**
    Storage related functions.
    @author Ian Buttimer
*/
import { 
    DEFAULT_SOUND_SETTING, DEFAULT_ANIMATION_SETTING
} from '../globals.js'

const SOUND_SETTING = 'rpsxSound';
const ANIMATION_SETTING = 'rpsxAnimation';
const LOCAL_KEYS = [SOUND_SETTING, ANIMATION_SETTING];

/**
 * Load user preferences
 * @param {GameState} gameState - current game state
 */
 export function loadPreferences(gameState) {
    if (storageAvailable('localStorage')) {
        LOCAL_KEYS.forEach(key => {
            let value = localStorage.getItem(key);
            switch (key) {
                case SOUND_SETTING:
                    gameState.soundEnabled = value ? value === 'true' : DEFAULT_SOUND_SETTING;
                    break;
                case ANIMATION_SETTING:
                    gameState.animationEnabled = value ? value === 'true' : DEFAULT_ANIMATION_SETTING;
                    break;
                default:
                    throw new Error(`Unknown key: ${key}`);
            }
        });
    }
}

/**
 * Save user preferences
 * @param {GameState} gameState - current game state
 */
export function savePreferences(gameState) {
    if (storageAvailable('localStorage')) {
        LOCAL_KEYS.forEach(key => {
            let value;
            switch (key) {
                case SOUND_SETTING:
                    value = gameState.soundEnabled;
                    break;
                case ANIMATION_SETTING:
                    value = gameState.animationEnabled;
                    break;
                default:
                    throw new Error(`Unknown key: ${key}`);
            }
            localStorage.setItem(key, new Boolean(value).toString());
        });
    }
}

/**
 * Check whether localStorage is both supported and available. 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API}
 * @param {string} type - 'localStorage' or 'sessionStorage'
 * @returns {boolean} true if available, otherwise false
 */
export default function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

/**
 * Read a boolean value from localStorage.
 * Note: storage values are 0 or non-zero number.
 * @param {string} key - storage key
 * @returns {boolean} true/false or false if not available or error
 */

 export function loadStorageBoolean(key) {
    const value = loadStorageInteger(key);
    return Number.isNaN(value) ? false : new Boolean(parseInt(enableLog)).valueOf();
}
/**
 * Read an integer value from localStorage
 * @param {string} key - storage key
 * @returns {number|Nan} number or NaN if not available or error
 */

export function loadStorageInteger(key) {
    const value = localStorage.getItem(key);
    return value ? parseInt(value) : NaN;
}
/**
 * Read a string value from localStorage
 * @param {string} key - storage key
 * @returns {string|null} number or null if not available or error
 */

export function loadStorageString(key) {
    return localStorage.getItem(key);
}
