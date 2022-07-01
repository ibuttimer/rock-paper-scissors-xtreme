/**
    Game play view.
    @author Ian Buttimer
*/
import { ResultCode } from "../enums.js";
import { 
    titleHeader, gameProgress, leaderBoard, playerSelectionTile, getPlayerSelectionTileParam
} from '../components/index.js'
import { 
    accumulator, htmlDiv, htmlButton, htmlSection, htmlAside, htmlH3, htmlP, ViewDetail 
} from '../utils/index.js';
import { SELECTION_TILE_DIV_PROP } from './game-params.js'

const continueButtonId = 'continue-button'

/**
 * Round result params for display
 * @param {string} resultText - result text to display
 * @param {string} buttonText - continue button text
 * @param {string} buttonClass - continue button class
 * @returns {object}
 */
 function resultCodeMapping(resultText, buttonText, buttonClass) {
    return {
        resultText: resultText, 
        buttonText: buttonText, 
        buttonClass: buttonClass
    };
}

/** Map of ResultCode and round result params
 * @type {ResultCode} key - result code
 * @type {object} value - info params
 */
const resultTexts = new Map([
    [ResultCode.MatchOver, resultCodeMapping('Match Over', 'Done', 'button__round-result-done')],
    [ResultCode.Winner, resultCodeMapping('Winner', 'Next game', 'button__round-result-next-game')],
    [ResultCode.Eliminate, resultCodeMapping('Eliminations', 'Next round', 'button__round-result-next-round')],
    [ResultCode.PlayAgain, resultCodeMapping('Play Again', 'Next round', 'button__round-result-next-round')]
]);

/**
 * Get the round result view details.
 * @param {GameState} gameState - game state object
 * @returns {ViewDetail} view details
 */
 export default function roundResultViewDetails(gameState) {

    return new ViewDetail(roundResultViewHtml(gameState))
                .setEventHandlerSetter(setRoundResultHandler);
}

/**
 * Generate the round result view.
 * @param {GameState} gameState - game state object
 * @returns {string} html for view
 */
function roundResultViewHtml(gameState) {
    const roundResult = gameState.roundResult;
    return `${titleHeader(gameState)}
            ${gameProgress(gameState.progressMap)}
            ${htmlDiv(['div__result-heading'], 
                htmlP([], 'Result'))}
            ${getResultText(roundResult)}
            ${getRoundResultAndLeaderBoard(gameState)}
            ${getExplanation(roundResult)}
            ${getContinueButton(roundResult)}`;
}

/**
 * Generate the round result and leader board component
 * @param {GameState} gameState - current game state
 * @returns {string} html for component
 */
function getRoundResultAndLeaderBoard(gameState) {

    const roundResultElement = htmlDiv(['div__round-result'],
            htmlSection(['section__round-result'], 
                    getPlayerSelections(gameState), {
                                            id: 'round-result'
            })
        );
    const leaderBoardElement = htmlAside(['aside__leader-board'], leaderBoard(gameState.topDownScores));
    return htmlDiv(['div__round-result-leader-board'], `${roundResultElement}
                                                        ${leaderBoardElement}`);
}

/**
 * Generate the player selections
 * @param {GameState} gameState - game state object
 * @returns {string} html for component
 * @see playerSelections {@link Game#roundSelections()}
 * @see selections {@link GameState#selections}
 */
function getPlayerSelections(gameState) {
    const roundResult = gameState.roundResult;
    const selections = gameState.selections;

    const winner = (roundResult.resultCode === ResultCode.Winner ||
                        roundResult.resultCode === ResultCode.MatchOver) ? roundResult.winning : undefined;

    return Array.from(roundResult.playerSelections).map(keyVal => {
        const player = keyVal[0];
        const selection = keyVal[1];
        const selectionInfo = selections.find(sel => sel.selection === selection);

        // player-specific css class for tile
        let classes = [player.css[SELECTION_TILE_DIV_PROP]];
        let banner = undefined;
        if (player === winner) {
            banner = "Winner";
        } else if (roundResult.losing.findIndex(loser => loser === player) >= 0) {
            if (gameState.animationEnabled) {
                classes.push('animate__fall-back');
            }
            classes.push('div__to-left-diagonal');
        }

        return htmlDiv(['div__player-selection-wrapper'],
                    playerSelectionTile(
                        getPlayerSelectionTileParam(
                            player, selectionInfo.src, selectionInfo.alt, selection, 
                            banner, classes)
                    )
                );
    }).reduce(accumulator, '');
}
 
/**
 * Generate the result text
 * @param {GameResult} roundResult - round result
 * @returns {string} html for component
 */
function getResultText(roundResult) {
    return htmlH3(['h3__round-result-text'],
                resultTexts.has(roundResult.resultCode) ? 
                    resultTexts.get(roundResult.resultCode).resultText : ''
            );
}
 
/**
 * Generate the explanation text
 * @param {GameResult} roundResult - round result
 * @returns {string} html for component
 */
function getExplanation(roundResult) {
    const resultCode = roundResult.resultCode;
    let explanation;
    switch (resultCode) {
        case ResultCode.Eliminate:
        case ResultCode.Winner:
        case ResultCode.MatchOver:
            explanation = roundResult.explanation.map(reason => {
                return htmlP(['p__elimination-explanation'], reason);
            }).reduce(accumulator, '');
            break;
        default:
            explanation = '';
            break;
    }

    return explanation;
}

/**
 * Generate the 'continue' button
 * @param {GameResult} roundResult - round result
 * @returns 
 */
function getContinueButton(roundResult) {
    const resultCode = roundResult.resultCode;
    let text;
    let className;

    if (resultTexts.has(resultCode)) {
        let setting = resultTexts.get(resultCode);
        text = setting.buttonText;
        className = setting.buttonClass;
    } else {
        throw new Error(`Unknown ResultCode: ${resultCode}`);
    }

    let ariaLabel;
    if (resultCode === ResultCode.MatchOver) {
        ariaLabel = `Match over, click to finish.`;
    } else {
        ariaLabel = `Click for ${text}.`;
    }
    const button = htmlButton([className, 'button__clickable', 'debossable'], text, {
        id: continueButtonId,
        'aria-label': ariaLabel,
        rel: 'next'
    });

    return text ? htmlDiv('div__round-result-next-button-wrapper', button) : null;
}

/**
 * Set handlers for round result
 * @param {GameState} gameState - game state object
 */
function setRoundResultHandler(gameState) {
    const button = document.getElementById(continueButtonId);
    if (button) {
        button.addEventListener('click', (event) => gameState.handleRoundResult(), false);
    }
}
