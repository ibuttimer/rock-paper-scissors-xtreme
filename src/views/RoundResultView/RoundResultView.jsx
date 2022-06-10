import React from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../App.js'
import { PLAY_URL } from '../../Globals.js'
import { ResultCode } from "../../services/index.js";
import { generateId } from "../../utils/index.js";
import { Title, GameProgress, PlayerSelectionTile, LeaderBoard } from '../../components/index.js';
import './RoundResultView.css';

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
    [ResultCode.Winner, resultCodeMapping('Winner', 'Next game', 'button__round-result-next-game')],
    [ResultCode.Eliminate, resultCodeMapping('Eliminations', 'Next round', 'button__round-result-next-round')],
    [ResultCode.PlayAgain, resultCodeMapping('Play Again', 'Next round', 'button__round-result-next-round')]
]);

/**
 * Function Component for Round result screen
 * @returns {React element} element to render
 */
export default function RoundResultView() {

    const gameState = React.useContext(AppContext);

    const navigate = useNavigate();

    /**
     * Generate the player selections
     * @param {GameResult} roundResult - round result
     * @returns 
     */
    function getPlayerSelections(roundResult) {

        const selections = gameState.selections;

        const winner = roundResult.resultCode === ResultCode.Winner ? roundResult.data : undefined;

        return Array.from(roundResult.playerSelections).map(keyVal => {
            const player = keyVal[0];
            const selection = keyVal[1];
            const selectionInfo = selections.find(sel => sel.selection === selection);
            const optionKey = generateId('player-selection-result', player.name);

            return (
                <div className='div__player-selection-wrapper' key={optionKey}>
                    <PlayerSelectionTile player={player.name} 
                        src={selectionInfo.src} alt={selectionInfo.alt} selection={selectionInfo.selection}
                        banner={player === winner ? 'Winner' : undefined} />
                </div>
            );            
        });
    }

    /**
     * Generate the result text
     * @param {GameResult} roundResult - round result
     * @returns 
     */
     function getResultText(roundResult) {
        return (
            <h3 className='h3_round-result-text'>
                {resultTexts.has(roundResult.resultCode) ? 
                    resultTexts.get(roundResult.resultCode).resultText : ''}
            </h3>
        );
    }

    /**
     * Generate the explanation text
     * @param {GameResult} roundResult - round result
     * @returns 
     */
     function getExplanation(roundResult) {
        const resultCode = roundResult.resultCode;
        if (resultCode !== ResultCode.Eliminate && resultCode !== ResultCode.Winner) {
            return null;
        }

        return roundResult.explanation.map(x => {
            return <p className='p__elimination-explanation'>{x}</p>
        });
    }

    /** Start next round */
    function nextRound() {
        gameState.nextRound();

        navigate(PLAY_URL);
    }

    /** Start next game */
    function nextGame() {
        gameState.nextGame();

        navigate(PLAY_URL);
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
        let continueFunction;

        if (resultTexts.has(resultCode)) {
            let setting = resultTexts.get(resultCode);
            text = setting.buttonText;
            className = setting.buttonClass;
            
            switch (resultCode) {
                case ResultCode.Winner:
                    continueFunction = () => nextGame();
                    break;
                case ResultCode.Eliminate:
                case ResultCode.PlayAgain:
                    continueFunction = () => nextRound();
                    break;
                default:
                    break;
            }
        }

        return text ? (
            <div className="div__round-result-next-button-wrapper">
                <button className={className} type='button' onClick={continueFunction}>
                    {text}
                </button>
            </div>
        ) : null;
    }

    /* render something based on the value */
    return (
        <main>
            <Title />
            {getResultText(gameState.roundResult)}
            <GameProgress progress={gameState.progressMap} />

            <LeaderBoard roundResult={gameState.roundResult} scores={gameState.scores} />

            <section className="section__round-result">
                {getPlayerSelections(gameState.roundResult)}
            </section>

            {getExplanation(gameState.roundResult)}

            {getContinueButton(gameState.roundResult)}

        </main>
    );
}
