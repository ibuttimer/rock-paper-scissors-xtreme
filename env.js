/**
    Environment constants.
    @author Ian Buttimer
*/
import { loadStorageString } from './assets/js/utils/index.js';

/* localStorage parameter keys */
export const ENABLE_LOG_KEY = 'ENABLE_LOG';
export const ASSETS_BASE_URL_KEY = 'ASSETS_BASE_URL';
export const VARIANT_KEY = 'VARIANT';
export const NUM_PLAYERS_KEY = 'NUM_PLAYERS';
export const NUM_ROBOTS_KEY = 'NUM_ROBOTS';
export const NUM_GAMES_KEY = 'NUM_GAMES';
export const VIEW_KEY = 'VIEW';

// check localStorage for a value (expecting '0' or '1') for ENABLE_LOG, if found use it otherwise set from environment constants
/* Note: If the value passed as the first parameter is omitted or is 0, -0, null, false, NaN, undefined, 
   or the empty string (""), the object has an initial value of false. All other values, including any object, 
   an empty array ([]), or the string "false", create an object with an initial value of true.
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean */
let enableLog = loadStorageString(ENABLE_LOG_KEY);
enableLog = enableLog === null ? enableLog = false : new Boolean(parseInt(enableLog)).valueOf();
// export const ENABLE_LOG = enableLog;

// check localStorage for a value for ASSETS_BASE_URL, if found use it otherwise set from environment constants
let assetsBaseUrl = loadStorageString(ASSETS_BASE_URL_KEY);
if (assetsBaseUrl === null) {
    assetsBaseUrl = 'assets/';
}

// clear local storage overrides for pristine start next time
// [ENABLE_LOG_KEY, ASSETS_BASE_URL_KEY].forEach(key => localStorage.removeItem(key));

export default {
    /** 
     * Assets folder relative to project root 
     */
    ASSETS_BASE_URL: assetsBaseUrl,
    /** 
     * Image assets folder relative to project root 
     */
    IMG_ASSETS_BASE_URL: `${assetsBaseUrl}img/`,
    /** 
     * Audio assets folder relative to project root 
     */
    AUDIO_ASSETS_BASE_URL: `${assetsBaseUrl}audio/`,
     /**
     * Enable console logging
     */
    ENABLE_LOG: enableLog
};