import React from 'react';
import { AppContext } from '../../App.js'
import { ResultCode } from "../../services/index.js";
import { generateId } from "../../utils/index.js";
import { Title, GameProgress, PlayerSelectionTile, LeaderBoard } from '../../components/index.js';
import './RoundResultView.css';

const resultTexts = new Map([
    [ResultCode.Winner, 'Winner'],
    [ResultCode.Eliminate, 'Eliminations'],
    [ResultCode.PlayAgain, 'Play Again']
]);

/**
 * Function Component for Round result screen
 * @returns {React element} element to render
 */
export default function RoundResultView() {

    const gameState = React.useContext(AppContext);

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
                {resultTexts.has(roundResult.resultCode) ? resultTexts.get(roundResult.resultCode) : ''}
            </h3>
        );
    }

    /**
     * Generate the explanation text
     * @param {GameResult} roundResult - round result
     * @returns 
     */
     function getExplanation(roundResult) {
        const resultCode = gameState.roundResult.resultCode;
        if (resultCode !== ResultCode.Eliminate && resultCode !== ResultCode.Winner) {
            return null;
        }

        return roundResult.explanation.map(x => {
            return <p className='p__elimination-explanation'>{x}</p>
        });
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

        </main>
    );
}
