/**
    Suite of utility functions.
    @author Ian Buttimer
*/
import { default as config } from '../../../env.js'
import { 
    MIN_PLAYERS, MAX_PLAYERS, MIN_ROBOTS, MAX_ROBOTS, MIN_PARTICIPANTS,
    BASIC_VARIANT_NAME, BIGBANG_VARIANT_NAME, XTREME_VARIANT_NAME
} from '../globals.js'
import { Game, GameVariant } from "../game.js";

/**
 * Check if a variable is null or undefined.
 * @param {*} variable - variable to check
 * @param {string} name - name of variable
 * @param {boolean} logError - log console error flag; default false
 * @returns {boolean} true if variable is set, otherwise false
 */
export function variableCheck(variable, name, logError = false) {
    let isSet = (variable !== null && variable !== undefined);
    if (!isSet && logError) {
        console.error(`Missing '${name}': null or undefined`);
    }
    return isSet;
}

/**
 * Check if a variable is null or undefined, optionally throwing an error.
 * @param {*} variable - variable to check
 * @param {string} name - name of variable
 * @param {boolean} throwError - throw error flag; default true
 * @returns {boolean} true if variable is set, otherwise false
 */
 export function requiredVariable(variable, name, throwError = true) {
    let isSet = variableCheck(variable, name, true);
    if (!isSet && throwError) {
        throw new Error(`Missing '${name}': null or undefined`);
    }
    return isSet;
}

/**
 * Check number of participants selection
 * @param {number} numPlayers - number of players
 * @param {number} numRobots - number of robots
 * @returns {Array|null} array of errors or null if no errors
 */
export function gameParticipantsCheck(numPlayers, numRobots) {
    let errors = []
    if (numPlayers && numPlayers < MIN_PLAYERS) {
        errors.push(`Insufficient number of players: minimum of ${MIN_PLAYERS} required`);
    }
    if (numRobots && numRobots < MIN_ROBOTS) {
        errors.push(`Insufficient number of robots: minimum of ${MIN_ROBOTS} required`);
    }
    if (numPlayers + numRobots < MIN_PARTICIPANTS) {
        errors.push(`Insufficient number of participants: minimum of ${MIN_PARTICIPANTS} required`);
    }
    if (numPlayers > MAX_PLAYERS) {
        errors.push(`Too many players: maximum of ${MAX_PLAYERS} allowed`);
    }
    if (numRobots > MAX_ROBOTS) {
        errors.push(`Too many robots: maximum of ${MAX_ROBOTS} allowed`);
    }
    return errors.length ? errors : null;
}

/**
 * Generate a string representation of a Map
 * @param {Map} map - map to convert to string
 * @param {string} open - start delimiter
 * @param {string} close - end delimiter
 * @param {string} join - key/value join
 * @param {string} separator - key/value pair separator
 * @returns {string}
 */
export function mapToString(map, open = '[', close = ']', join = ':', separator = ', ') {
    let str = open;
    for (const [key, value] of map) {
        if (str.length > open.length) {
            str += separator;
        }
        str += `${key}${join}${value}`;
      }
      return str + close;
}

/**
 * Get the display information for the game variant.
 * @param {Game|GameVariant} game - game or game variant object
 * @returns {object} object of the form {
 *                      name: {variant name}
 *                      css: {css class}
 *                   }
 */
 export function getVariantInfo(game) {
    let name;
    let variant;
    if (game instanceof Game) {
        game = game.variant;
    } else if (!(game instanceof GameVariant)) {
        throw new Error(`Unknown object ${game}`);
    }
    switch (game) {
        case GameVariant.Basic:
            name = BASIC_VARIANT_NAME;
            variant ='variant_basic';
            break;
        case GameVariant.BigBang:
            name = BIGBANG_VARIANT_NAME;
            variant = 'variant_bigbang';
            break;
        case GameVariant.Xtreme:
            name = XTREME_VARIANT_NAME;
            variant = 'variant_xtreme';
            break;
        default:
            throw new Error(`Unknown variant ${game.variant}`);
    }
    // css classes have naming convention '<css property>__<variant>'
    return {
        name: name,
        css: {
            color: `color__${variant}`,
            background_color: `background-color__${variant}`,
        }
    };
}

/**
 * Replace whitespace in a string 
 * @param {string} source - source string
 * @param {string} replacement - replacement string; default '-'
 * @returns {string} id
 */
function replaceWhitespace(identifier, replacement = '-') {
    return `${identifier.replaceAll(/\W+/g, replacement)}`;
}

/**
 * Generate an element id
 * @param {string} identifier - element identifier
 * @param {string} modifier - element modifier
 * @returns {string} id
 */
export function generateId(identifier, modifier) {
    let id = `${replaceWhitespace(identifier)}`;
    if (modifier) {
        id = `${id}-${replaceWhitespace(modifier)}`;
    }
    return id;
}

/**
 * Generate a list of HTML option elements
 * @param {string} id - id of select element
 * @param {Array[any]} array - array of select option values
 * @param {any} defaultValue - default value
 * @param {Function} valueModifier - function to modify values; default pass through
 * @returns {Array} array of elements
 */
export function optionsList(id, array, defaultValue, valueModifier = y => y) {
    return array.map(x => {
            let value = valueModifier(x);
            let selected = value === defaultValue ? 'selected' : '';
            return `<option value=${value} ${selected}>${value}</option>`;
        });
}

/** Accumulator function for {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce} */
export const accumulator = (previousValue, currentValue) => previousValue + currentValue;

const ADD_STYLE = 0;
const REMOVE_STYLE = 1;
const REPLACE_STYLE = 2;
/**
 * Add/remove/replace element classes
 * @param {number} action - action to perform
 * @param {Element|Array[Element]|HTMLCollection} elements - element(s) to perform action on
 * @param {string|Array[string]} classes - class(s) to add/remove, or class to replace
 * @param {string} replacement - replacement class
 * 
 * Note: An HTMLCollection in the HTML DOM is live; it is automatically updated when the underlying document is changed. 
 * For this reason it is a good idea to make a copy (eg. using Array.from) to iterate over if adding, moving, or removing nodes.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection}
 */
const modifyElementClassList = (action, elements, classes, replacement) => {
    if (!(elements instanceof HTMLCollection) && !Array.isArray(elements)) {
        elements = [elements];
    }
    for (const element of elements) {
        switch (action) {
            case ADD_STYLE:
            case REMOVE_STYLE:
                if (typeof classes === 'string') {
                    classes = [classes];
                }
                if (action == ADD_STYLE) {
                    element.classList.add(...classes);
                } else {
                    element.classList.remove(...classes);
                }
                break;
            case REPLACE_STYLE:
                if (element.classList.contains(classes)) {
                    element.classList.replace(classes, replacement);
                } else {
                    // class to replace isn't there so just add replacement
                    element.classList.add(replacement);
                }
                break;
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }
}

/**
 * Add element class(es)
 * @param {Element|Array[Element]} elements - element(s) to perform action on
 * @param {string|Array[string]} classes - class(es) to add
 */
export const addElementClass = (elements, classes) => modifyElementClassList(ADD_STYLE, elements, classes);
/**
 * Remove element class(es)
 * @param {Element|Array[Element]} elements - element(s) to perform action on
 * @param {string|Array[string]} classes - class(es) to remove
 */
export const removeElementClass = (elements, classes) => modifyElementClassList(REMOVE_STYLE, elements, classes);
/**
 * Replace element class
 * @param {Element|Array[Element]} elements - element(s) to perform action on
 * @param {string} remove - class to replace
 * @param {string} replacement - replacement class
 */
export const replaceElementClass = (elements, remove, replacement) => modifyElementClassList(REPLACE_STYLE, elements, remove, replacement);

/**
 * Delay execution of a function; e.g. delay(1000).then(() => console.log('1 sec later))
 * @param {number} time - time, in milliseconds that the timer should wait before the specified function or code is executed
 * @returns {Promise} Promise that will be resolved after the specified time
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/setTimeout}
 */
export function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Adjust the specified array to contain the required number of entries
 * @param {Array[any]} array - current array
 * @param {number} requiredNum - required number of entries
 * @param {function} newEntry - function accepting an index argument to create a new entry object
 * @returns {Array[any]} adjusted array
 */
export function adjustArray(array, requiredNum, newEntry) {
    if (requiredNum > array.length) {
        // add new objects
        for (let index = array.length; index < requiredNum; index++) {
            array.push(newEntry(index));
        }
    } else if (requiredNum < array.length) {
        // remove excess objects
        array = array.slice(0, requiredNum);
    }
    return array;
}

/**
 * Log to console
 * @param {...any} data - info to log
 */
export function log(...data) {
    if (config.ENABLE_LOG){
        console.log(...data);
    }
}

/* Jasmine requires a default export */
export default 'utils.js'
