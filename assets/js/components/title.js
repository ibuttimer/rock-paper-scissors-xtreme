/**
    Game utility components.
    @author Ian Buttimer
*/
import { GAME_NAME } from "../globals.js";
import { getVariantInfo, htmlH1, htmlH3, htmlSpan } from "../utils/index.js";

/**
 * Page title component
 * @param {GameState} gameState - game state object
 * @returns {string} html for title component
 */
export default function titleHeader(gameState) {
    const variant = getVariantInfo(gameState.game);
    return htmlH1(['h1__main-title'], 
        `${GAME_NAME} ${htmlSpan([variant.css.color], variant.name)}`);
}

/**
 * Current player name title component
 * @param {GameState} gameState - game state object
 * @returns {string|undefined} html for player name component or undefined if no current player
 */
 export function currentPlayerNameHeader(gameState) {
    const player = gameState.game.currentPlayer;
    return player ? htmlH3(['h3__sub-title', player.css.color], player.name) : undefined;
}