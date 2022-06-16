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
        htmlH3('h3__player-selection-tile-banner', params.banner) : '';
    const playerName = htmlH4(
        ['h4__player-selection-tile-player-name', params.player.css.color], params.player.name);
    const image = htmlImg('img__player-selection-tile-img', {
        src: params.src, alt: params.alt
    });
    const selectionName = htmlH4('h4__player-selection-tile-name', params.selection.name);

    let classes = ['div__player-selection-tile-wrapper'];
    if (params.classes) {
        classes = classes.concat(Array.isArray(params.classes) ? params.classes : [params.classes]);
    }

    return htmlDiv(classes, [banner, playerName, image, selectionName].join(' '));
}

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