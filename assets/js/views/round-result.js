/**
    Game play view.
    @author Ian Buttimer
*/
import { ROOT_URL, PLAY_URL, log } from '../globals.js';
import { ResultCode } from "../enums.js";
import { 
    titleHeader, gameProgress, leaderBoard, playerSelectionTile, getPlayerSelectionTileParam
} from '../components/index.js'
import { generateId, accumulator } from '../utils/index.js';
import { View, setView } from '../routing.js'


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
    [ResultCode.MatchOver, resultCodeMapping('Match Over', 'Done', 'button__round-result-next-game')],
    [ResultCode.Winner, resultCodeMapping('Winner', 'Next game', 'button__round-result-next-game')],
    [ResultCode.Eliminate, resultCodeMapping('Eliminations', 'Next round', 'button__round-result-next-round')],
    [ResultCode.PlayAgain, resultCodeMapping('Play Again', 'Next round', 'button__round-result-next-round')]
]);

/**
 * Generate the round result view.
 * @param {GameState} gameState - game state object
 * @returns {string} html for view
 */
export default function roundResultView(gameState) {
    const roundResult = gameState.roundResult;
    return `${titleHeader(gameState)}
            ${getResultText(roundResult)}
            ${gameProgress(gameState.progressMap)}
            ${leaderBoard(gameState.topDownScores)}
            <section class="section__round-result">
                ${getPlayerSelections(gameState)}
            </section>
            ${getExplanation(roundResult)}
            ${getContinueButton(roundResult)}`;
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
                        roundResult.resultCode === ResultCode.MatchOver) ? roundResult.data : undefined;

    return Array.from(roundResult.playerSelections).map(keyVal => {
        const player = keyVal[0];
        const selection = keyVal[1];
        const selectionInfo = selections.find(sel => sel.selection === selection);
        const optionKey = generateId('player-selection-result', player.name);

        return `<div class="div__player-selection-wrapper" key=${optionKey}>
                    ${playerSelectionTile(
                        getPlayerSelectionTileParam(
                            player, selectionInfo.src, selectionInfo.alt, selection, player === winner ? "Winner" : undefined)
                    )}
                </div>`;
    }).reduce(accumulator, '');
}
 
/**
 * Generate the result text
 * @param {GameResult} roundResult - round result
 * @returns {string} html for component
 */
function getResultText(roundResult) {
    return `<h3 class='h3_round-result-text'>
                ${resultTexts.has(roundResult.resultCode) ? 
                    resultTexts.get(roundResult.resultCode).resultText : ''}
           </h3>`;
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
                return `<p class='p__elimination-explanation'>${reason}</p>`
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

    return text ? `<div class="div__round-result-next-button-wrapper">
                        <button id=${continueButtonId} class=${className} type='button'>
                            ${text}
                        </button>
                   </div>` : null;
}

/**
 * Set handlers for round result
 * @param {GameState} gameState - game state object
 */
export function setRoundResultHandler(gameState) {
    const button = document.getElementById(continueButtonId);
    if (button) {
        button.addEventListener('click', (event) => gameState.handleRoundResult(), false);
    }
}
