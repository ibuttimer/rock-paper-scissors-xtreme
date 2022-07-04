/**
    Game play view.
    @author Ian Buttimer
*/
import { ROUND_RESULT_URL, SHOW_SEL_KEYS_PROPERTY } from '../globals.js';
import { titleHeader, currentPlayerNameHeader, gameProgress } from '../components/index.js'
import { 
    accumulator, htmlDiv, htmlImg, htmlP, htmlSection, ViewDetail,
    addElementClass, removeElementClass, replaceElementClass, delay, log 
} from '../utils/index.js';
import { setView } from '../routing.js'
import { SELECTION_TILE_DIV_PROP } from './game-params.js'

const currentPlayerHeaderId = 'current-player-header'

const selKeysVisibleClass = 'p__selection-tile-key';
const selKeysHiddenClass = 'p__selection-tile-key-hidden';

const in_animation = 'animate__fade-in';
const out_animation = 'animate__fade-out';
const animation_time = 500;    // animation time in msecs

/**
 * Get the game play view details.
 * @param {GameState} gameState - game state object
 * @returns {ViewDetail} view details
 */
 export default function gamePlayViewDetails(gameState) {

    return new ViewDetail(gamePlayViewHtml(gameState))
                .setObserver(new MutationObserver(playMutationsCallback), playMutationObserverConfig)
                .setSettingListener(playSettingsChangeListener)
                .setEventHandlerSetter(setPlayHandler);
}

/**
 * Get class to identify current game variant, e.g. 'variant-bigbang'
 * @param {GameState} gameState - current game state
 * @returns 
 */
const variantClassName = (gameState) => { return `variant-${gameState.game.variant.name.toLowerCase()}`; };

/**
 * Generate the game play view.
 * @param {GameState} gameState - game state object
 * @returns {string} html for view
 */
 function gamePlayViewHtml(gameState) {

    gameState.selectionHandledCallback = handleSelectionCallback;

    // player-specific css class for tile
    const tileClass = gameState.game.currentPlayer.css[SELECTION_TILE_DIV_PROP];

    const playerNameHtml = htmlDiv(['div__play-player-name'], currentPlayerNameHeader(gameState), {
        id: currentPlayerHeaderId
    });
    const playerSelectionsHtml = htmlDiv(['div__play-area', variantClassName(gameState)], 
                            getSelections(gameState, tileClass));

    return `${titleHeader(gameState)}
            ${gameProgress(gameState.progressMap)}
            ${htmlDiv(['div__play-instruction'], 
                htmlP([], 'Make round selection'))}
            ${htmlSection(['section__select-play'], 
                playerNameHtml + 
                playerSelectionsHtml)}`;
}

/**
 * Generate the selection options
 * @param {GameState} gameState - game state object
 * @param {string} tileClass - player-specific css class
 * @returns {string} html for selection options
 */
function getSelections(gameState, tileClass) {
    const variantClass = variantClassName(gameState);

    return gameState.selections.map(sel => {
        return htmlDiv(['div__selection-option-wrapper'], 
                            selectionTile(sel, tileClass, gameState.showSelectionKeys, variantClass));
    }).reduce(accumulator, '');
}

/**
 * Class representing a selection tile
 * @param {object} params - parameters object {@link selectionTileParams}
 * @param {string} tileClass - player-specific css class
 * @param {boolean} showKey - show selection key
 * @param {string} variantClass - class to identify current variant
 * @returns {string} html for selection tile
 */
 export function selectionTile(params, tileClass, showKey, variantClass) {
    const clickToSelect = `Click to select ${params.selection.name} or, press ${params.selection.key.key}.`;
    const image = htmlImg(['img__selection-tile-img', variantClass], {
        src: params.src, 
        alt: `${params.alt} ${clickToSelect}`
    });
    const name = htmlP([
            // reduce font size on longer names
            params.selection.name.length > 7 ? 'p__selection-tile-name-long' : 
                params.selection.name.length > 5 ? 'p__selection-tile-name-med' : 'p__selection-tile-name', 
            variantClass
        ], 
        params.selection.name);
    const key = htmlP(showKey ? selKeysVisibleClass : selKeysHiddenClass, 
        `<i class="lni lni-keyboard"></i>&nbsp;${params.selection.key.key.toUpperCase()}`);

    return htmlDiv(['div__selection-tile-wrapper', 'debossable-nbi', tileClass], 
        `${image} ${name} ${key}`, {
            'data-selection': params.selection,
            role: 'button',
            'aria-label': clickToSelect
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
            if (gameState.game.roundInProgress) {
                nextPlayerName(gameState, tiles);
            }
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
    const html = currentPlayerNameHeader(gameState);
    if (currentPlayerHeaderElement && html) {
        currentPlayerHeaderElement.innerHTML = html;

        // update border colour to player's colour
        const colour = gameState.game.currentPlayer.colour;
        for (const tile of tiles) {
            tile.style.borderColor = colour;
        }
    }
}

/**
 * Set handlers for game play
 * @param {GameState} gameState - game state object
 * @return {object} event handlers
 */
function setPlayHandler(gameState) {
    for (const tile of allSelectionTiles()) {
        tile.addEventListener('click', (event) => gamePlayHandler(event, gameState), false);
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(playMutationsCallback);

    return {
        observer: observer,
        options: playMutationObserverConfig,
        settingListener: playSettingsChangeListener
    };
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

/**
 * Options for the observer (which mutations to observe)
 * @see {@link https://dom.spec.whatwg.org/#dictdef-mutationobserverinit}
 */
const playMutationObserverConfig = { attributes: true, childList: true, subtree: true };

/**
 * Callback function to execute when mutations are observed
 * @param {Array[MutationRecord]} mutationList 
 * @param {MutationObserver} observer 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#specifications}
 */
const playMutationsCallback = function(mutationList, observer) {
    for(const mutation of mutationList) {
        if (mutation.type === 'childList') {
            log('A child node has been added or removed.');
        }
        else if (mutation.type === 'attributes') {
            log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

/**
 * Handle a setting change
 * @param {string} property - GameState property name
 * @param {boolean} value - new setting value
 */
function playSettingsChangeListener(property, value) {
    if (property === SHOW_SEL_KEYS_PROPERTY) {
        const toRemove = value ? selKeysHiddenClass : selKeysVisibleClass;
        const toAdd = value ? selKeysVisibleClass : selKeysHiddenClass;
        replaceElementClass(
            // make copy of HTMLCollection as it'll automatically update as classes are updated
            Array.from(
                document.getElementsByClassName(toRemove)
            ), toRemove, toAdd);
    }
}