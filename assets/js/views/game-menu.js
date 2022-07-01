/**
    Game selection menu view.
    @author Ian Buttimer
*/
import { 
    GAME_NAME, BASIC_URL, BASIC_VARIANT_NAME, BIGBANG_URL, BIGBANG_VARIANT_NAME, 
    XTREME_URL, XTREME_VARIANT_NAME
} from '../globals.js';
import { default as config } from '../../../env.js';
import { log } from '../utils/index.js'
import { GameVariant } from '../game.js';
import { setView } from '../routing.js'
import { 
    getVariantInfo, htmlDiv, htmlButton, htmlImg, htmlSource, htmlPicture, 
    htmlSpan, htmlH1, htmlH2, htmlSection 
} from '../utils/index.js'


/** Image info object */
const ImgInfo = (type, file) => { return { type: type, file: file }; };

// Parameters for game select menu options
/** Index of variant url, values are @type {string} */
const URL_IDX = 0;              
/** Index of variant, values are @type {GameVariant} */
const VARIANT_IDX = 1;
/** Index of variant name, values are @type {string} */
const VARIANT_NAME_IDX = 2;
/** Index of variant image(s) 
 * Array of values of @type {ImgInfo}
 * Note: last entry will get 'img' tag, others 'source' tag.
 */
const VARIANT_IMG_IDX = 3;
const gameParams = [
    [BASIC_URL, GameVariant.Basic, BASIC_VARIANT_NAME, [
        ImgInfo('webp', 'basic.webp'),
        ImgInfo('png', 'basic.png'),
    ]],
    [BIGBANG_URL, GameVariant.BigBang, BIGBANG_VARIANT_NAME, [
        ImgInfo('webp', 'big-bang.webp'),
        ImgInfo('png', 'big-bang.png'),
    ]],
    [XTREME_URL, GameVariant.Xtreme, XTREME_VARIANT_NAME, [
        ImgInfo('webp', 'xtreme.webp'),
        ImgInfo('png', 'xtreme.png'),
    ]],
];
const gameSelects = gameParams.map(params => {
    const info = getVariantInfo(params[VARIANT_IDX]);
    return gameSelectParams(
                params[URL_IDX], 
                params[VARIANT_IDX], 
                gameTileParams(params[VARIANT_NAME_IDX], 
                                params[VARIANT_IMG_IDX].map(
                                    element => {
                                        element.file = `${config.IMG_ASSETS_BASE_URL}${element.file}`;
                                        return element;
                                    }), 
                                `${params[VARIANT_IDX].name} game image`, 
                                info.css)
            );
})

/**
 * Generate the game select menu.
 * @returns {string} html for menu
 */
export default function gameSelectMenu() {
    return htmlH1(['h1__main-title'], GAME_NAME) +
            htmlSection([],
                htmlH2(['h2__sub-title'], 'Select game') +
                htmlDiv(['div__variant-options'], 
                    gameSelects.reduce(
                        (innerHtml, params) => innerHtml + getGameSelect(params),
                        '')
                )
            );
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

/** Basic css classes for all game select tiles */
const gameSelectTileClasses = [
    'button__variant-select', 'div__variant-tile-wrapper', 'debossable'
];

/**
 * Generate a game select option.
 * @param {*} params - parameters object {@link gameSelectParams}
 * @returns {string} html for game select option
 */
function getGameSelect(params) {
    return htmlDiv(['div__variant-select'],
        htmlButton(
            gameSelectTileClasses.concat([params.tile.css.background_color]), 
            getGameTile(params.tile), {
                type: 'button',
                'data-url': params.url,
                'aria-label': `select ${params.variant.name} game.`,
                rel: 'next'
            })
    );
}

/**
 * Generate a game tile parameters object
 * @param {string} name - name of game variant
 * @param {Array[ImgInfo]} src - image source
 * @param {string} alt - image alt text
 * @param {object} css - object with variant specific css class names; key is property and value is class
 * @returns {object}
 */
function gameTileParams(name, src, alt, css) {
    return {
        name: name,
        src: src,
        alt: alt,
        css: css
    }
}

/**
 * Generate a game select option.
 * @param {*} params - parameters object {@link gameTileParams}
 * @returns {string} html for game select option
 */
function getGameTile(params) {
    let imgSrc = params.src;
    const isArray = Array.isArray(imgSrc);
    let singleSrc = typeof imgSrc === 'string';

    if (isArray && imgSrc.length === 1) {
        imgSrc = imgSrc[0];
        singleSrc = true;
    }

    let visual;
    if (singleSrc) {
        // single source, use img
        visual = htmlImg(['img__variant-tile-img'], {
            src: imgSrc.file,
            alt: params.alt
        });
    } else {
        // multiple sources, use picture
        const sources = imgSrc.reduce((previous, current, index, array) => {
            let src;
            if (index < array.length - 1) {
                src = htmlSource([], {
                    srcset: current.file,
                    type: `image/${current.type}`
                });
            } else {
                src = htmlImg(['img__variant-tile-img'], {
                    src: current.file,
                    alt: params.alt
                });
            }
            return `${previous} ${src}`;
        }, '')

        visual = htmlPicture([], sources);
    }

    return visual + htmlSpan(['span__variant-tile-name'], params.name);
}

/**
 * Set click handlers for game select menu
 * @param {GameState} gameState - game state object
 */
export function setMenuHandler(gameState) {
    const buttons = document.getElementsByClassName('button__variant-select');
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

        log(event, gameState);

        setView(gameParams[index][URL_IDX], gameState);
    } else {
        throw new Error(`Unknown game url: ${url}`);
    }
}
