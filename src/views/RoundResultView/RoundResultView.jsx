import React from 'react';
import { AppContext } from '../../App.js'
import { Subscription, generateId } from "../../utils/index.js";
import { Title, RoundNumber, PlayerSelectionTile, LeaderBoard } from '../../components/index.js';
import './RoundResultView.css';

/**
 * Function Component for Round result screen
 * @returns {React element} element to render
 */
export default function RoundResultView() {

    const gameState = React.useContext(AppContext);

    const roundSubscription = new Subscription();

    /**
     * Generate the player selections
     * @param {GameResult} roundResult - round result
     * @returns 
     */
    function getPlayerSelections(roundResult) {

        const selections = gameState.selections;

        return Array.from(roundResult.playerSelections).map(keyVal => {
            const player = keyVal[0];
            const selection = keyVal[1];
            const selectionInfo = selections.find(sel => sel.selection === selection);
            const optionKey = generateId('player-selection-result', player.name);

            return (
                <div className='div__player-selection-wrapper' key={optionKey}>
                    <PlayerSelectionTile player={player.name} 
                        src={selectionInfo.src} alt={selectionInfo.alt} selection={selectionInfo.selection} />
                </div>
            );            
        });
    }

    /* render something based on the value */
    return (
        <main>
            <Title />
            <RoundNumber round={gameState.currentGame} 
                subscription={roundSubscription} />

            <LeaderBoard roundResult={gameState.roundResult} scores={gameState.scores} />

            <section className="section__round-result">
                {getPlayerSelections(gameState.roundResult)}
            </section>
        </main>
    );
}
