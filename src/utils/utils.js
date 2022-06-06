import { 
    BASIC_VARIANT_NAME, BIGBANG_VARIANT_NAME, XTREME_VARIANT_NAME
} from "../Globals.js";
import { Game, GameVariant } from "../services/game.js";


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
 * @param {Array} array - array of select option values
 * @param {Function} valueModifier - function to modify values; default pass through
 * @returns {Array} array of elements
 */
export function optionsList(id, array, valueModifier = y => y) {
    return array.map(x => {
            let value = valueModifier(x);
            let optKey = `${id}-${value}`;
            return <option value={value} key={optKey}>{value}</option>;
        });
}
