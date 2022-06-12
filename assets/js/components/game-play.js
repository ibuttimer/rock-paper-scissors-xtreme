/**
    Game play view.
    @author Ian Buttimer
*/
import { ROUND_RESULT_URL, log } from '../globals.js';
import { ResultCode, GameKey } from "../enums.js";
import { default as titleHeader, currentPlayerNameHeader } from './title.js'
import { generateId, optionsList, accumulator } from '../utils/index.js';
import { View, setView } from '../views.js'


const currentPlayerHeaderId = 'current-player-header'

/**
 * Generate the game play view.
 * @param {GameState} gameState - game state object
 * @returns {string} html for view
 */
 export default function getGamePlayView(gameState) {
    return `${titleHeader(gameState)}
            ${gameProgress(gameState.progressMap)}
            <div id="${currentPlayerHeaderId}">
                ${currentPlayerNameHeader(gameState)}
            </div>
            <section class="section__select-play">
                ${getSelectable(gameState.selections)}
            </section>`;
}

/**
 * Generate the selection options
 * @param {Array} selections - array of all possible Selection for game variant
 * @returns {string} html for selection options
 */
function getSelectable(selections) {
    return selections.map(sel => {
        let optionKey = `num-games-option-${sel.selection.name}`;

        return `<div class='div__selection-option-wrapper' key=${optionKey}>
                    ${selectionTile(sel)}            
                </div>`;            
    }).reduce(accumulator, '');
}

/**
 * Class representing a selection tile
 * @param {object} option - parameters object {@link selectionTileParams}
 */
 export function selectionTile(params) {
    return `<div class="div__selection-tile-wrapper" data-selection="${params.selection}" 
                    aria-label="select ${params.selection.name}.">
                <img class="img__selection-tile-img" src="${params.src}" alt="${params.alt}" />
                <h4 class="h4__selection-tile-name">${params.selection.name}</h4>
            </div>`;
}

/**
 * Get game play progress component
 * @param {Map} progress - match progress {@link GameState#progressMap()}
 */
 export function gameProgress(progress) {
    return `<div class='div__game-progress-wrapper'>
                <table class='table__game-progress'>
                    <tbody>
                        ${getGameProgress(progress)}
                    </tbody>
                </table>
            </div>`;
}

/**
 * Generate the progress rows
 * @param {Map} progress - round result {@link GameState#progressMap()}
 * @param {scores} scores - map of scores with players as key
 * @returns 
 */
function getGameProgress(progress) {

    return Array.from(progress).map((entry, index) => {
        let rowKey = `game-progress-row-${index}`;

        return `<tr class='tr__game-progress-row' key=${rowKey}>
                    <td class='td__game-progress-info'>${entry[0]}</td>
                    <td class='td__game-progress-data'>${entry[1]}</td>
                </tr>`;
    }).reduce(accumulator, '');
}

/**
 * Handle selection made by player
 * @param {Selection|GameKey|string} selection - Selection or key associated with selection
 * @param {GameState} gameState - game state object
 */
function handleSelection(selection, gameState) {
    const eventResult = gameState.game.makePlayEvent(selection);
    if (eventResult.roundInProgress) {
        // round in progress, update display for next player
        const currentPlayerHeaderElement = document.getElementById(currentPlayerHeaderId);
        currentPlayerHeaderElement.innerHTML = currentPlayerNameHeader(gameState);
    } else  {
        // round finished
        const gameResult = eventResult.gameResult;
        gameState.roundResult = gameResult;

        switch (gameResult.resultCode) {
            case ResultCode.Winner:
                // update score
                let player = gameResult.data;
                gameState.incPlayerScore(player);

                // check if best of winner
                const bestOfWinner = gameState.haveBestOfWinner();
                if (bestOfWinner.soleWinner) {
                    // single winner, match over
                    gameResult.resultCode = ResultCode.MatchOver;
                } else if (bestOfWinner.multiWinner) {
                    throw new Error(`Unexpected multi-winner: ${bestOfWinner.count}`);
                }
                break;
            default:
                break;
        }

        setView(ROUND_RESULT_URL, gameState);
    }
}

/**
 * Set handlers for game play
 * @param {GameState} gameState - game state object
 */
export function setPlayHandler(gameState) {
    const tiles = document.getElementsByClassName('div__selection-tile-wrapper');
    for (const tile of tiles) {
        tile.addEventListener('click', (event) => gamePlayHandler(event, gameState), false);
    }
}

/**
 * Handle game play
 * @param {Event} event - event object
 * @param {GameState} gameState - game state object
 */
 function gamePlayHandler(event, gameState) {
    const selection = event.currentTarget.dataset.selection;
    if (selection) {
        if (gameState.game.variant.isValidSelection(selection)) {
            handleSelection(selection, gameState);
        }
    }
}
