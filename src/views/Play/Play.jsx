import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../App.js'
import { ROUND_RESULT_URL } from '../../Globals.js'
import { Subscription } from "../../utils/index.js";
import { Title, GameProgress, CurrentPlayerName, SelectionTile } from '../../components/index.js';
import { ResultCode, GameKey } from "../../services/index.js";
import './Play.css';

/**
 * Function Component for Play screen
 * @returns {React element} element to render
 */
export default function Play() {

    const gameState = React.useContext(AppContext);

    const navigate = useNavigate();

    const playerSubscription = new Subscription();

    const beep = new Audio('assets/audio/beep-10.mp3');

    useEffect(() => {
        // https://www.pluralsight.com/guides/event-listeners-in-react-components
        document.addEventListener('keydown', handleKeyDown, false);

        console.log('added listener');

        // cleanup this component
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    /**
     * Keyboard event listener
     * @param {KeyboardEvent} event - @see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent}
     */
     const handleKeyDown = (event) => {
        // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
        const key = GameKey.keyEvent(event);
        const game = gameState.game;

        if (game.roundInProgress && game.variant.isValidKey(key)) {
            handleSelection(key);
        } else {
            beep.play();   
        }
    };

    /**
     * Generate the selection options
     * @param {Array} selections - array of all possible Selection for game variant
     * @returns 
     */
    function getSelectable(selections) {
        return selections.map(x => {
            let optionKey = `num-games-option-${x.selection.name}`;

            return (
                <div className='div__selection-option-wrapper' key={optionKey}>
                    <SelectionTile src={x.src} alt={x.alt} selection={x.selection} onclick={handleSelection}/>
                </div>
            );            
        });
    }

    /**
     * Handle selection made by player
     * @param {Selection|GameKey|string} selection - Selection or key associated with selection
     */
    function handleSelection(selection) {
        const eventResult = gameState.game.makePlayEvent(selection);
        if (eventResult.roundInProgress) {
            // round in progress, update display for next player
            playerSubscription.notifyListeners(gameState.currentPlayerName);
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

            navigate(ROUND_RESULT_URL);
        }
    }

    /* render something based on the value */
    return (
        <main>
            <Title />
            <GameProgress progress={gameState.progressMap} />
            <CurrentPlayerName playerName={gameState.currentPlayerName}
                subscription={playerSubscription} />

            <section className="section__select-play">
                {getSelectable(gameState.selections)}
            </section>
        </main>
    );
}

