/**
    Storage related functions.
    @author Ian Buttimer
*/
import { 
    DEFAULT_SOUND_SETTING, DEFAULT_ANIMATION_SETTING, DEFAULT_LANDING_SETTING,
    SOUND_PROPERTY, ANIMATION_PROPERTY, LANDING_PROPERTY
} from '../globals.js'

const SOUND_SETTING = 'rpsxSound';
const ANIMATION_SETTING = 'rpsxAnimation';
const LANDING_SETTING = 'rpsxLanding';

/**
 * Setting parameter object
 * @param {string} property - GameState property name
 * @param {string} defaultValue - default value
 * @returns {object}
 */
 const propertyDefault = (property, defaultValue) => {
    return { property: property, defaultValue: defaultValue };
};
/** 
 * Map of settings
 * @type {string} key - localStorage key
 * @type {object} value - setting parameter object @see {@link propertyDefault}
 */
 const keyProperty = new Map([
    [SOUND_SETTING, propertyDefault(SOUND_PROPERTY, DEFAULT_SOUND_SETTING)],
    [ANIMATION_SETTING, propertyDefault(ANIMATION_PROPERTY, DEFAULT_ANIMATION_SETTING)],
    [LANDING_SETTING, propertyDefault(LANDING_PROPERTY, DEFAULT_LANDING_SETTING)]
]);

/**
 * Load user preferences
 * @param {GameState} gameState - current game state
 */
 export function loadPreferences(gameState) {
    if (storageAvailable('localStorage')) {
        for (const [key, propDflt] of keyProperty.entries()) {
            let value = localStorage.getItem(key);
            gameState[propDflt.property] = value ? value === 'true' : propDflt.defaultValue;
        }
    }
}

/**
 * Save user preferences
 * @param {GameState} gameState - current game state
 */
export function savePreferences(gameState) {
    if (storageAvailable('localStorage')) {
        for (const [key, propDflt] of keyProperty.entries()) {
            localStorage.setItem(key, new Boolean(gameState[propDflt.property]).toString());
        }
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
