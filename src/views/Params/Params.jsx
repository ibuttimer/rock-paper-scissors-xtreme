import React from 'react';
import { AppContext } from '../../App.js'
import { 
    GAME_NAME, MIN_PLAYERS, MAX_PLAYERS, MIN_ROBOTS, MAX_ROBOTS, DEFAULT_PLAYERS, DEFAULT_ROBOTS
} from './../../Globals.js'
import { getVariantName } from "../../utils";
import { NumPlayers } from "../../components/index.js";
import './Params.css';

/**
 * Function Component for Params screen
 * @returns {React element} element to render
 */
 export default function Params() {
    const game = React.useContext(AppContext);

    // https://bobbyhadz.com/blog/react-select-onchange

    /**
     * Set the number of players.
     * @param {number} num - number of players 
     */
     function setNumPlayers(event) {
        game.setNumPlayers(event.target.value);
    }

    /**
     * Set the number of robots.
     * @param {number} num - number of robots 
     */
     function setNumRobots(event) {
        game.setNumRobots(event.target.value);
    }

    return (
        <AppContext.Consumer>
            { value => 
                <main>
                    <h1 className="h1__main-title">{GAME_NAME} {getVariantName(value)}</h1>
                    <div className="div__num-of-game-participants">
                        <NumPlayers title='Number of players' 
                            min={MIN_PLAYERS} max={MAX_PLAYERS} default={DEFAULT_PLAYERS}
                            onchange={setNumPlayers} />
                        <NumPlayers title='Number of robots' 
                            min={MIN_ROBOTS} max={MAX_ROBOTS} default={DEFAULT_ROBOTS}
                            onchange={setNumRobots} />
                    </div>
                </main>
            }
        </AppContext.Consumer>
    );
}

