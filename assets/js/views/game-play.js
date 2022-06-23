/**
    Game play view.
    @author Ian Buttimer
*/
import { ROUND_RESULT_URL, log } from '../globals.js';
import { titleHeader, currentPlayerNameHeader, gameProgress } from '../components/index.js'
import { 
    accumulator, htmlDiv, htmlImg, htmlH4, htmlSection, 
    addElementClass, removeElementClass, replaceElementClass, delay 
} from '../utils/index.js';
import { setView } from '../routing.js'
import { SELECTION_TILE_DIV_PROP } from './game-params.js'

const currentPlayerHeaderId = 'current-player-header'

const in_animation = 'animate__fade-in';
const out_animation = 'animate__fade-out';
const animation_time = 500;    // animation time in msec

/**
 * Generate the game play view.
 * @param {GameState} gameState - game state object
 * @returns {string} html for view
 */
 export default function gamePlayView(gameState) {

    gameState.selectionHandledCallback = handleSelectionCallback;

    // player-specific css class for tile
    const tileClass = gameState.game.currentPlayer.css[SELECTION_TILE_DIV_PROP];

    return `${titleHeader(gameState)}
            ${gameProgress(gameState.progressMap)}
            ${htmlDiv(['div__play-player-name'], currentPlayerNameHeader(gameState), {
                id: currentPlayerHeaderId
            })}
            ${htmlSection(['section__select-play'], 
                getSelectable(gameState.selections, tileClass))}`;
        }

/**
 * Generate the selection options
 * @param {Array} selections - array of all possible Selection for game variant
 * @param {string} tileClass - player-specific css class
 * @returns {string} html for selection options
 */
function getSelectable(selections, tileClass) {
    return selections.map(sel => {
        return htmlDiv(['div__selection-option-wrapper'], selectionTile(sel, tileClass));
    }).reduce(accumulator, '');
}

/**
 * Class representing a selection tile
 * @param {object} params - parameters object {@link selectionTileParams}
 * @param {string} tileClass - player-specific css class
 * @returns {string} html for selection tile
 */
 export function selectionTile(params, tileClass) {
    const image = htmlImg('img__selection-tile-img', {
        src: params.src, alt: params.alt
    });
    const name = htmlH4(
        // reduce font size on longer names
        params.selection.name.length > 7 ? 'h4__selection-tile-name-long' : 
            params.selection.name.length > 5 ? 'h4__selection-tile-name-med' : 'h4__selection-tile-name', 
        params.selection.name);

    return htmlDiv(['div__selection-tile-wrapper', 'debossable-nbi', tileClass], 
        `${image}
        ${name}`, {
            'data-selection': params.selection,
            'aria-label': `Click to select ${params.selection.name} or, press ${params.selection.key.key}.`
        });
}

/**
 * Handle in progress callback following selection made by player
 * @param {GameState} gameState - game state object
 * @param {PlayEventResult} eventResult - result of handling event
 */
export function handleSelectionCallback(gameState, eventResult) {
    if (eventResult.roundInProgress) {
        // round in progress, update display for next player
        nextPlayer(gameState);
    } else  {
        // round finished
        setView(ROUND_RESULT_URL, gameState);
    }
}

/**
 * Transition to next player
 * @param {GameState} gameState - current game state
 */
 function nextPlayer(gameState) {
    let time = 0;
    const tiles = allSelectionTiles();

    if (gameState.animationEnabled) {
        addElementClass(tiles, [out_animation]);

        time += animation_time;   
        delay(time).then(() => {
            // update player name & selection tiles
            nextPlayerName(gameState, tiles);
    
            replaceElementClass(tiles, out_animation, in_animation);
        });
        time += animation_time;
        delay(time).then(() => {
            removeElementClass(tiles, [in_animation]);
        });
    } else {
        // update player name & selection tiles
        nextPlayerName(gameState, tiles);
    }
}

/**
 * Update player name & selection tiles for next player
 * @param {GameState} gameState - current game state
 * @param {Array[Element]} tiles - player selection tiles
 */
 function nextPlayerName(gameState, tiles) {
    // update player name
    const currentPlayerHeaderElement = document.getElementById(currentPlayerHeaderId);
    currentPlayerHeaderElement.innerHTML = currentPlayerNameHeader(gameState);

    // update border colour to player's colour
    const colour = gameState.game.currentPlayer.colour;
    for (const tile of tiles) {
        tile.style.borderColor = colour;
    }
}

/**
 * Set handlers for game play
 * @param {GameState} gameState - game state object
 */
export function setPlayHandler(gameState) {
    for (const tile of allSelectionTiles()) {
        tile.addEventListener('click', (event) => gamePlayHandler(event, gameState), false);
    }
}

/** All selection tiles */
const allSelectionTiles = () => { 
    return document.getElementsByClassName('div__selection-tile-wrapper');
}

/**
 * Handle game play
 * @param {Event} event - event object
 * @param {GameState} gameState - game state object
 */
 function gamePlayHandler(event, gameState) {
    const selection = event.currentTarget.dataset.selection;
    if (selection) {
        gameState.handleSelection(selection);
    }
}
