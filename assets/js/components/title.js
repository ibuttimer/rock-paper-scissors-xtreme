/**
    Game utility components.
    @author Ian Buttimer
*/
import { GAME_NAME } from "../globals.js";
import { getVariantName } from "../utils/index.js";

/**
 * Page title component
 * @param {GameState} gameState - game state object
 * @returns {string} html for title component
 */
export default function titleHeader(gameState) {
    return `<h1 class="h1__main-title">${GAME_NAME} ${getVariantName(gameState.game)}</h1>`;
}

/**
 * Current player name title component
 * @param {GameState} gameState - game state object
 * @returns {string} html for player name component
 */
 export function currentPlayerNameHeader(gameState) {
    return `<h3 class="h3__sub-title">${gameState.game.currentPlayer.name}</h3>`;
}