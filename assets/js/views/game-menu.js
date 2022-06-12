/**
    Game selection menu view.
    @author Ian Buttimer
*/
import { 
    GAME_NAME, BASIC_URL, BASIC_VARIANT_NAME, BIGBANG_URL, BIGBANG_VARIANT_NAME, 
    XTREME_URL, XTREME_VARIANT_NAME, IMG_ASSETS_BASE_URL, log 
} from '../globals.js';
import { GameVariant } from '../game.js';
import { View, setView } from '../routing.js'


// Parameters for game select menu options
const URL_IDX = 0;
const VARIANT_IDX = 1;
const VARIANT_NAME_IDX = 2;
const VARIANT_IMG_IDX = 3;
const gameParams = [
    [BASIC_URL, GameVariant.Basic, BASIC_VARIANT_NAME, 'basic.png'],
    [BIGBANG_URL, GameVariant.BigBang, BIGBANG_VARIANT_NAME, 'big-bang.png'],
    [XTREME_URL, GameVariant.Xtreme, XTREME_VARIANT_NAME, 'xtreme.png'],
]
const gameSelects = gameParams.map(params => {
    return gameSelectParams(params[URL_IDX], params[VARIANT_IDX], 
                gameTileParams(params[VARIANT_NAME_IDX], `${IMG_ASSETS_BASE_URL}${params[VARIANT_IMG_IDX]}`, 
                                `${params[VARIANT_IDX].name} game image`))

})

/**
 * Generate the game select menu.
 * @returns {string} html for menu
 */
export default function gameSelectMenu() {
    return `<h1 class="h1__main-title">${GAME_NAME}</h1>
            <h2 class="h2__sub-title">Select game</h2>
            <section class="section__select-game">
                ${gameSelects.reduce(
                    (innerHtml, params) => innerHtml + getGameSelect(params),
                    ''
                  )}
            </section>`;
}

/**
 * Generate a game selection parameters object
 * @param {string} url - url for link
 * @param {GameVariant} variant - game variant
 * @param {string} tile - name
 * @returns {object}
 */
function gameSelectParams(url, variant, tile) {
    return {
        url: url,
        variant: variant,
        tile: tile
    }
}

/**
 * Generate a game select option.
 * @param {*} params - parameters object {@link gameSelectParams}
 * @returns {string} html for game select option
 */
function getGameSelect(params) {
    return `<article>
                <button type="button" class="button__game-select" data-url="${params.url}" 
                        aria-label="select ${params.variant.name} game." rel="next">
                    ${getGameTile(params.tile)}
                </button>
            </article>`
}

/**
 * Generate a game tile parameters object
 * @param {string} name - name of game variant
 * @param {string} src - image source
 * @param {string} alt - image alt text
 * @returns {object}
 */
function gameTileParams(name, src, alt) {
    return {
        name: name,
        src: src,
        alt: alt
    }
}

/**
 * Generate a game select option.
 * @param {*} params - parameters object {@link gameTileParams}
 * @returns {string} html for game select option
 */
function getGameTile(params) {
    return `<div class="div__game-tile-wrapper">
                <img class="img__game-tile-img" src="${params.src}" alt="${params.alt}" />
                <h3 class="h3__game-tile-name">${params.name}</h3>
            </div>`
}

/**
 * Set click handlers for game select menu
 * @param {GameState} gameState - game state object
 */
export function setMenuHandler(gameState) {
    const buttons = document.getElementsByTagName('button');
    for (const button of buttons) {
        button.addEventListener('click', (event) => gameMenuHandler(event, gameState), false);
    }
}

/**
 * Handle game selection
 * @param {Event} event - event object
 * @param {GameState} gameState - game state object
 */
function gameMenuHandler(event, gameState) {
    const url = event.currentTarget.dataset.url;
    const index = gameParams.findIndex(p => p[URL_IDX] === url);
    if (index >= 0)  {
        gameState.game.variant = gameParams[index][VARIANT_IDX];

        log(event, gameState);

        setView(gameParams[index][URL_IDX], gameState);
    } else {
        throw new Error(`Unknown game url: ${url}`);
    }
}
