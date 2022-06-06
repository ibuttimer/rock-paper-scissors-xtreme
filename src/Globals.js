/* Application global constants */

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
export const MIN_GAMES = 1;
export const MAX_GAMES = 15;
export const DEFAULT_GAMES = 3;

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
export const RULES_ROUTE = 'rules';
export const RULES_URL = makePath(RULES_ROUTE);
export const BASIC_ROUTE = 'basic';
export const BASIC_URL = makePath(BASIC_ROUTE);
export const BIGBANG_ROUTE = 'bigbang';
export const BIGBANG_URL = makePath(BIGBANG_ROUTE);
export const XTREME_ROUTE = 'xtreme';
export const XTREME_URL = makePath(XTREME_ROUTE);

export default COPYRIGHT;