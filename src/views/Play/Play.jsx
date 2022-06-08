import React, { useState, useEffect } from 'react';
import { AppContext } from '../../App.js'
import { GAME_NAME } from "../../Globals";
import { getVariantName, Subscription } from "../../utils/index.js";
import { Title, RoundNumber, CurrentPlayerName, SelectionTile } from '../../components/index.js';
import { GameVariant, RoundResult, GameKey } from "../../services/index.js";
import './Play.css';

/**
 * Function Component for Play screen
 * @returns {React element} element to render
 */
export default function Play() {

    const gameState = React.useContext(AppContext);

    const roundSubscription = new Subscription();
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
            let selection = x[0];
            let src = x[1].src;
            let alt = x[1].alt;
            let optionKey = `num-games-option-${selection.name}`;

            return (
                <div className='div__selection-option-wrapper' key={optionKey}>
                    <SelectionTile src={src} alt={alt} selection={selection} onclick={handleSelection}/>
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
            // round in progress, update for next player
            playerSubscription.notifyListeners(gameState.currentPlayerName);
        } else  {
            // round finished
            const roundResult = eventResult.result;
            switch (roundResult.result) {
                case RoundResult.Winner:
                    let player = roundResult.data;
                    let score = gameState.scores.get(player);
                    gameState.scores.set(player, score + 1);
                    break;
                default:
                    break;
            }
        }
    }

    /* render something based on the value */
    return (
        <main>
            <Title />
            <RoundNumber round={gameState.currentGame} 
                subscription={roundSubscription} />
            <CurrentPlayerName playerName={gameState.currentPlayerName}
                subscription={playerSubscription} />

            <section className="section__select-play">
                {getSelectable(gameState.selections)}
            </section>
        </main>
    );
}

