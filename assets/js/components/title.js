/**
    Game utility components.
    @author Ian Buttimer
*/
import { GAME_NAME } from "../globals.js";
import { getVariantInfo, htmlH3 } from "../utils/index.js";

/**
 * Page title component
 * @param {GameState} gameState - game state object
 * @returns {string} html for title component
 */
export default function titleHeader(gameState) {
    const variant = getVariantInfo(gameState.game);
    return `<h1 class="h1__main-title">${GAME_NAME} <span class="${variant.css.color}">${variant.name}</span></h1>`;
}

/**
 * Current player name title component
 * @param {GameState} gameState - game state object
 * @returns {string} html for player name component
 */
 export function currentPlayerNameHeader(gameState) {
    const player = gameState.game.currentPlayer;
    return htmlH3(['h3__sub-title', player.css.color], player.name);
}