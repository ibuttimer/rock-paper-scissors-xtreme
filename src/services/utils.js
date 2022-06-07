/**
    Suite of utility functions.
    @author Ian Buttimer
*/
import { 
    MIN_PLAYERS, MAX_PLAYERS, MIN_ROBOTS, MAX_ROBOTS, MIN_PARTICIPANTS 
} from '../Globals.js'

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

/* Jasmine requires a default export */
export default 'utils.js'
