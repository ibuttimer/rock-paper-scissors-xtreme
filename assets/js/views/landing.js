/**
    Game selection menu view.
    @author Ian Buttimer
*/
import { GAME_NAME, GAME_URL, RULES_URL } from '../globals.js';
import { setView } from '../routing.js'
import { 
    htmlDiv, htmlButton, htmlH1, htmlH2, htmlSection 
} from '../utils/index.js'

const gameButtonId = 'game-select-button';
const rulesButtonId = 'game-rules-button';

/**
 * Generate the landing menu.
 * @returns {string} html for menu
 */
export default function landingPage() {
    return htmlH1(['h1__main-title'], GAME_NAME) +
            htmlDiv('div__landing-content',
                htmlSection([],
                    htmlH2(['h2__sub-title'], "I know what I'm doing") +
                    htmlDiv('div__landing-play', 
                        htmlButton(['button__select-game', 'button__clickable', 'debossable'], "Let's Play", {
                            id: gameButtonId,
                            'aria-label': 'select game to play.',
                            value: GAME_URL
                        })
                    )
                ) + 
                htmlSection([],
                    htmlH2(['h2__sub-title'], "So how does this work then?") +
                    htmlDiv('div__landing-how-to', 
                        htmlButton(['button__how-to', 'button__clickable', 'debossable'], "How to Play", {
                            id: rulesButtonId,
                            'aria-label': 'how to play the game.',
                            value: RULES_URL
                        })
                    )
                )
            );
}

/**
 * Set click handlers for landing menu
 * @param {GameState} gameState - game state object
 */
export function setLandingHandler(gameState) {

    const buttons = [gameButtonId, rulesButtonId].map(id => document.getElementById(id));
    for (const button of buttons) {
        button.addEventListener('click', (event) => landingHandler(event, gameState), false);
    }
}

/**
 * Handle landing option selection
 * @param {Event} event - event object
 * @param {GameState} gameState - game state object
 */
function landingHandler(event, gameState) {
    const url = event.currentTarget.value;

    setView(url, gameState);
}