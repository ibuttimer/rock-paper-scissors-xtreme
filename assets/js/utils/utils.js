/**
    Suite of utility functions.
    @author Ian Buttimer
*/
import { 
    MIN_PLAYERS, MAX_PLAYERS, MIN_ROBOTS, MAX_ROBOTS, MIN_PARTICIPANTS,
    BASIC_VARIANT_NAME, BIGBANG_VARIANT_NAME, XTREME_VARIANT_NAME
} from '../globals.js'
import { Game, GameVariant } from "../game.js";

/**
 * Check if a variable is null or undefined.
 * @param {*} variable - variable to check
 * @param {string} name - name of variable
 * @param {boolean} log - log console error flag; default false
 * @returns {boolean} true if variable is set, otherwise false
 */
export function variableCheck(variable, name, log = false) {
    let isSet = (variable !== null && variable !== undefined);
    if (!isSet && log) {
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
 * Get the display name for the game variant.
 * @param {Game|GameVariant} game - game or game variant object
 */
 export function getVariantName(game) {
    let name;
    if (game instanceof Game) {
        game = game.variant;
    } else if (!(game instanceof GameVariant)) {
        throw new Error(`Unknown object ${game}`);
    }
    switch (game) {
        case GameVariant.Basic:
            name = BASIC_VARIANT_NAME;
            break;
        case GameVariant.BigBang:
            name = BIGBANG_VARIANT_NAME;
            break;
        case GameVariant.Xtreme:
            name = XTREME_VARIANT_NAME;
            break;
        default:
            throw new Error(`Unknown variant ${game.variant}`);
    }
    return name;
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
            let optKey = `${id}-${value}`;
            let selected = value === defaultValue ? 'selected' : '';
            return `<option value=${value} key=${optKey} ${selected}>${value}</option>`;
        });
}

/** Accumulator function for {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce} */
export const accumulator = (previousValue, currentValue) => previousValue + currentValue;

/* Jasmine requires a default export */
export default 'utils.js'
