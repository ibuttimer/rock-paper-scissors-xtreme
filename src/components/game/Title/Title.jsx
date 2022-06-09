import React, { useState, useEffect } from 'react';
import { AppContext } from '../../../App.js'
import { GAME_NAME } from "../../../Globals";
import { getVariantName } from "../../../utils/index.js";
import './Title.css';

/**
 * Function Component for page Title
 * @returns {React element} element to render
 */
export function Title() {

    const gameState = React.useContext(AppContext);

    /* render something based on the value */
    return (
        <h1 className="h1__main-title">{GAME_NAME} {getVariantName(gameState.game)}</h1>
    );
}

/**
 * Custom hook to render player name
 * @param {object} props - properties
 * @returns 
 * @see https://reactjs.org/docs/hooks-custom.html
 * @see https://reactjs.org/docs/hooks-effect.html
 */
 export function CurrentPlayerName(props) {
    const [playerName, setPlayerName] = useState(props.playerName);    

    useEffect(() => {
        function handlePlayerChange(playerName) {
            setPlayerName(playerName);
        }
        props.subscription.registerListener(handlePlayerChange);
        return () => {
            // clean up run when this component unmounts.
            props.subscription.unregisterListener(handlePlayerChange);
        };
    });
    return (
        <h3 className="h3__sub-title">{playerName}</h3>
    );
}