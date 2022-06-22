/**
    Player's selection tile component.
    @author Ian Buttimer
*/
import { htmlDiv, htmlImg, htmlH3, htmlH4 } from '../utils/index.js'

/**
 * Player's selection tile component
 * @param {object} params - params object {@link getPlayerSelectionTileParam()}
 * @returns {string} html for component
 */
 export default function playerSelectionTile(params) {

    const banner = params.banner ?
        htmlH3([
            'h3__play-sel-tile-banner', h3SizeModifier(params.banner)
        ], params.banner) : '';
    const playerName = htmlH4([
        'h4__play-sel-tile-player-name', params.player.css.color, h4SizeModifier(params.player.name),
        'std-line-height'
    ], params.player.name);
    const image = htmlImg('img__play-sel-tile-img', {
        src: params.src, alt: params.alt
    });
    const selectionName = htmlH4([
        'h4__play-sel-tile-name', h4SizeModifier(params.selection.name)
    ], params.selection.name);

    let classes = ['div__play-sel-tile-wrapper'];
    if (params.classes) {
        classes = classes.concat(Array.isArray(params.classes) ? params.classes : [params.classes]);
    }

    return htmlDiv(classes, [banner, playerName, image, selectionName].join(' '));
}

/**
 * Get H4 font size css class based on length of text to display.
 * @param {string} text - text to display 
 * @returns {string} css class
 */
 const h4SizeModifier = (text) => text.length > 7 ? 'h4__play-sel-tile-long' : 
                                    text.length > 5 ? 'h4__play-sel-tile-med' : '';

/**
 * Get H3 font size css class based on length of text to display.
 * @param {string} text - text to display 
 * @returns {string} css class
 */
 const h3SizeModifier = (text) => text.length > 7 ? 'h3__play-sel-tile-long' : 
                                    text.length > 5 ? 'h3__play-sel-tile-med' : '';

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