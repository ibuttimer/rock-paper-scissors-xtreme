/**
    Player's selection tile component.
    @author Ian Buttimer
*/
import { htmlDiv, htmlImg, htmlH3, htmlP } from '../utils/index.js'

/**
 * Player's selection tile component
 * @param {object} params - params object {@link getPlayerSelectionTileParam()}
 * @returns {string} html for component
 */
 export default function playerSelectionTile(params) {

    const banner = params.banner ?
        htmlH3([
            'p__play-sel-tile-banner', bannerSizeModifier(params.banner)
        ], params.banner) : '';
    const playerName = htmlP([
        'p__play-sel-tile-player-name', params.player.css.color, tilePlayerSizeModifier(params.player.name),
        'std-line-height'
    ], params.player.name);
    const image = htmlImg('img__play-sel-tile-img', {
        src: params.src, 
        alt: `${params.alt} ${`Selected by ${params.player.name}.`}`
    });
    const selectionName = htmlP([
        'p__play-sel-tile-name', tilePlayerSizeModifier(params.selection.name)
    ], params.selection.name);

    let classes = ['div__play-sel-tile-wrapper'];
    if (params.classes) {
        classes = classes.concat(Array.isArray(params.classes) ? params.classes : [params.classes]);
    }

    return htmlDiv(classes, [banner, playerName, image, selectionName].join(' '), {
        role: 'note',
        'aria-label': `${params.player.name} selected ${params.selection.name}.`
    });
}

/**
 * Get player name font size css class based on length of text to display.
 * @param {string} text - text to display 
 * @returns {string} css class
 */
 const tilePlayerSizeModifier = (text) => text.length > 7 ? 'p__play-sel-tile-name-long' : 
                                    text.length > 5 ? 'p__play-sel-tile-name-med' : '';

/**
 * Get banner font size css class based on length of text to display.
 * @param {string} text - text to display 
 * @returns {string} css class
 */
 const bannerSizeModifier = (text) => text.length > 7 ? 'p__play-sel-tile-banner-long' : 
                                    text.length > 5 ? 'p__play-sel-tile-banner-med' : '';

/**
 * Generate a player selection tile parameter object
 * @param {string} player - player name
 * @param {string} src - image source
 * @param {string} alt - image alt text
 * @param {Selection} selection - selection
 * @param {string} banner - banner text
 * @param {string} classes - player-specific css class
 * @returns {object} parameter object
 */
export function getPlayerSelectionTileParam(player, src, alt, selection, banner, classes) {
    return {
        player: player, 
        src: src, 
        alt: alt, 
        selection: selection, 
        banner: banner,
        classes: classes
    };
}