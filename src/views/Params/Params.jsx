import React from 'react';
import { AppContext } from '../../App.js'
import { 
    GAME_NAME, MIN_PLAYERS, MAX_PLAYERS, MIN_ROBOTS, MAX_ROBOTS, DEFAULT_PLAYERS, DEFAULT_ROBOTS,
    MIN_GAMES, MAX_GAMES, DEFAULT_GAMES
} from './../../Globals.js'
import { getVariantName, generateId } from "../../utils";
import { NumPlayers, NumGames, numGamesOption } from "../../components/index.js";
import './Params.css';

/**
 * Function Component for Params screen
 * @returns {React element} element to render
 */
 export default function Params() {
    const gameState = React.useContext(AppContext);
    const oneGameTitle = 'One game shoot-out';
    const oneGameRadioId = generateId(oneGameTitle);
    const bestOfTitle = 'Best of';
    const bestOfRadioId = generateId(bestOfTitle);
    const bestOfSelectId = `${bestOfRadioId}-select`;

    // https://bobbyhadz.com/blog/react-select-onchange

    const setNumPlayers = (event) => {
        gameState.game.setNumPlayers(event.target.value);
        console.log(gameState.game);
    };

    const setNumRobots = (event) => {
        gameState.game.setNumRobots(event.target.value);
        console.log(gameState.game);
    };

    const selectedBestOf = () => gameState.bestOf = parseInt(
        document.getElementById(bestOfSelectId).value
    );

    /**
     * Set the number of games.
     * @param {Event} event - HTMLElement: change event
     */
     function setNumGames(event) {
        if (event.target.id === oneGameRadioId) {
            if (event.target.checked) {
                gameState.bestOf = 1;
            }
        } else if (event.target.id === bestOfRadioId) {
            if (event.target.checked) {
                selectedBestOf();
            }
        } else if (event.target.id === bestOfSelectId) {
            document.getElementById(bestOfRadioId).checked = true;
            selectedBestOf();
        }
        console.log(gameState);
    }

    const options = [
        numGamesOption(oneGameTitle, null, 1, oneGameRadioId),
        numGamesOption(
            bestOfTitle, 
            // odd numbers greater than 1 up to max inclusive
            [...Array((MAX_GAMES + 2) - MIN_GAMES + 1).keys()].filter(x => x > 1 && x % 2), 
            DEFAULT_GAMES !== 1 ? DEFAULT_GAMES : MIN_GAMES,
            bestOfRadioId,
            bestOfSelectId
        )
    ];

    return (
        <AppContext.Consumer>
            { value => 
                <main>
                    <h1 className="h1__main-title">{GAME_NAME} {getVariantName(value.game)}</h1>
                    <div className="div__num-of-game-participants">
                        <NumPlayers 
                            title='Number of players' 
                            min={MIN_PLAYERS} max={MAX_PLAYERS} default={DEFAULT_PLAYERS}
                            onchange={setNumPlayers} />
                        <NumPlayers 
                            title='Number of robots' 
                            min={MIN_ROBOTS} max={MAX_ROBOTS} default={DEFAULT_ROBOTS}
                            onchange={setNumRobots} />
                    </div>
                    <div className="div__num-of-games">
                        <NumGames 
                            options={options} group={'num-of-games'} default={DEFAULT_GAMES} 
                            onchange={setNumGames} />
                    </div>
                </main>
            }
        </AppContext.Consumer>
    );
}
