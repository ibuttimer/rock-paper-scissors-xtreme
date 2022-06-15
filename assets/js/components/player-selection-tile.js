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

    return htmlDiv(['div__player-selection-tile-wrapper', params.tileClass],
                    `${banner}
                    ${playerName}
                    ${image}
                    ${selectionName}`);
}

/**
 * Generate a player selection tile parameter object
 * @param {string} player - player name
 * @param {string} src - image source
 * @param {string} alt - image alt text
 * @param {Selection} selection - selection
 * @param {string} banner - banner text
 * @param {string} tileClass - player-specific css class
 * @returns {object} parameter object
 */
export function getPlayerSelectionTileParam(player, src, alt, selection, banner, tileClass) {
    return {
        player: player, 
        src: src, 
        alt: alt, 
        selection: selection, 
        banner: banner,
        tileClass: tileClass
    };
}