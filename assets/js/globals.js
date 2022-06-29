/**
    Application global constants.
    @author Ian Buttimer
*/
import { default as config } from '../../env.js'

export const GAME_NAME = 'Rock Paper Scissors';
export const BASIC_VARIANT_NAME = 'Basic';
export const BIGBANG_VARIANT_NAME = 'Big Bang';
export const XTREME_VARIANT_NAME = 'Xtreme';
export const COPYRIGHT = 'Ian Buttimer';
export const YEAR = '2022';
export const MIN_PLAYERS = 1;
export const MAX_PLAYERS = 9;
export const DEFAULT_PLAYERS = 2;
export const MIN_ROBOTS = 0;
export const MAX_ROBOTS = 3;
export const DEFAULT_ROBOTS = 0;
export const MIN_PARTICIPANTS = DEFAULT_PLAYERS + DEFAULT_ROBOTS;
export const MAX_PARTICIPANTS = MAX_PLAYERS + MAX_ROBOTS;
export const MIN_GAMES = 1;
export const MAX_GAMES = 15;
export const DEFAULT_GAMES = 3;
export const DEFAULT_SOUND_SETTING = false;
export const DEFAULT_ANIMATION_SETTING = true;

export const PLAYER_COLOURS = [
    'red', 'green', 'blue', 'aqua', 'darkgrey', 'orange', 
    'deeppink', 'salmon', 'teal', 'chocolate', 'orchid', 'darkseagreen'
];
console.assert(
    PLAYER_COLOURS.length === MAX_PARTICIPANTS, 
    `Incorrect number of player colours: ${PLAYER_COLOURS.length}, expected ${MAX_PARTICIPANTS}`
);


/**
 * Make a url.
 * @returns {string} url
 */
function makePath() {
    let url = ROOT_URL;
    for (let index = 0; index < arguments.length; index++) {
        if (index > 0 && index < arguments.length - 1) {
            url += '/';
        }
        url += arguments[index];
    }
    return url;
}

export const ROOT_URL = '/';
export const GAME_ROUTE = 'game';
export const GAME_URL = makePath(GAME_ROUTE);
export const RULES_ROUTE = 'rules';
export const RULES_URL = makePath(RULES_ROUTE);
export const BASIC_ROUTE = 'basic';
export const BASIC_URL = makePath(BASIC_ROUTE);
export const BIGBANG_ROUTE = 'bigbang';
export const BIGBANG_URL = makePath(BIGBANG_ROUTE);
export const XTREME_ROUTE = 'xtreme';
export const XTREME_URL = makePath(XTREME_ROUTE);
export const PLAY_ROUTE = 'play';
export const PLAY_URL = makePath(PLAY_ROUTE);
export const ROUND_RESULT_ROUTE = 'roundresult';
export const ROUND_RESULT_URL = makePath(ROUND_RESULT_ROUTE);

/**
 * Log to console
 * @param {...any} data - info to log
 */
export function log(...data) {
    if (config.ENABLE_LOG){
        console.log(...data);
    }
}

export default COPYRIGHT;