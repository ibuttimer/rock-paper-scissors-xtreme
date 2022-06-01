/**
    Suite of utility functions.
    @author Ian Buttimer
*/

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

/* Jasmine requires a default export */
export default 'utils.js'
