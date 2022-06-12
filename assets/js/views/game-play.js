/**
    Game play view.
    @author Ian Buttimer
*/
import { ROUND_RESULT_URL, log } from '../globals.js';
import { ResultCode, GameKey } from "../enums.js";
import { titleHeader, currentPlayerNameHeader, gameProgress } from '../components/index.js'
import { generateId, optionsList, accumulator } from '../utils/index.js';
import { View, setView } from '../routing.js'


const currentPlayerHeaderId = 'current-player-header'

/**
 * Generate the game play view.
 * @param {GameState} gameState - game state object
 * @returns {string} html for view
 */
 export default function gamePlayView(gameState) {

    gameState.selectionHandledCallback = handleSelectionCallback;

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
 * Handle in progress callback following selection made by player
 * @param {GameState} gameState - game state object
 * @param {PlayEventResult} eventResult - result of handling event
 */
export function handleSelectionCallback(gameState, eventResult) {
    if (eventResult.roundInProgress) {
        // round in progress, update display for next player
        const currentPlayerHeaderElement = document.getElementById(currentPlayerHeaderId);
        currentPlayerHeaderElement.innerHTML = currentPlayerNameHeader(gameState);
    } else  {
        // round finished
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
        gameState.handleSelection(selection)
    }
}
