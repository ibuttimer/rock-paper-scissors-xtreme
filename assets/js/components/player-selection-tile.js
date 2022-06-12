/**
    Player's selection tile component.
    @author Ian Buttimer
*/

/**
 * Player's selection tile component
 * @param {object} params - params object {@link getPlayerSelectionTileParam()}
 * @returns {string} html for component
 */
 export default function playerSelectionTile(params) {
    return `<div class="div__player-selection-tile-wrapper">
            ${params.banner ? `<h3 class="h3__player-selection-tile-banner">${params.banner}</h3>` : ''}
            <h4 class="h4__player-selection-tile-player-name">${params.player.name}</h4>
            <img class="img__player-selection-tile-img" src=${params.src} alt=${params.alt}/>
            <h4 class="h4__player-selection-tile-name">${params.selection.name}</h4>
        </div>`;
}

/**
 * Generate a player selection tile parameter object
 * @param {string} player - player name
 * @param {string} src - image source
 * @param {string} alt - image alt text
 * @param {Selection} selection - selection
 * @param {string} banner - banner text
 * @returns {object} parameter object
 */
export function getPlayerSelectionTileParam(player, src, alt, selection, banner) {
    return {
        player: player, 
        src: src, 
        alt: alt, 
        selection: selection, 
        banner: banner
    };
}