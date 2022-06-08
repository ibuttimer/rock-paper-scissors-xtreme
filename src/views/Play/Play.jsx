import React, { useState, useEffect } from 'react';
import { AppContext } from '../../App.js'
import { GAME_NAME } from "../../Globals";
import { getVariantName, Subscription } from "../../utils/index.js";
import { SelectionTile } from '../../components/index.js';
import { GameVariant, RoundResult } from "../../services/index.js";
import './Play.css';

/**
 * Function Component for Play screen
 * @returns {React element} element to render
 */
export default function Play() {

    const gameState = React.useContext(AppContext);

    const roundSubscription = new Subscription();
    const playerSubscription = new Subscription();

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
            <h1 className="h1__main-title">{GAME_NAME} {getVariantName(gameState.game)}</h1>
            
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

/**
 * Custom hook to render round number
 * @param {object} props - properties
 * @returns 
 * @see https://reactjs.org/docs/hooks-custom.html
 * @see https://reactjs.org/docs/hooks-effect.html
 */
function RoundNumber(props) {
    const [roundNumber, setRoundNumber] = useState(props.round);    

    useEffect(() => {
        function handleRoundChange(round) {
            setRoundNumber(round);
        }
        props.subscription.registerListener(handleRoundChange);
        return () => {
            props.subscription.unregisterListener(handleRoundChange);
        };
    });
    return (
        <h2 className="h2__sub-title">Round {roundNumber}</h2>
    );
}

/**
 * Custom hook to render player name
 * @param {object} props - properties
 * @returns 
 * @see https://reactjs.org/docs/hooks-custom.html
 * @see https://reactjs.org/docs/hooks-effect.html
 */
 function CurrentPlayerName(props) {
    const [playerName, setPlayerName] = useState(props.playerName);    

    useEffect(() => {
        function handlePlayerChange(playerName) {
            setPlayerName(playerName);
        }
        props.subscription.registerListener(handlePlayerChange);
        return () => {
            props.subscription.unregisterListener(handlePlayerChange);
        };
    });
    return (
        <h3 className="h3__sub-title">{playerName}</h3>
    );
}