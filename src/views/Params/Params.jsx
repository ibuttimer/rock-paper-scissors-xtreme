import React, { useState } from 'react';
import { AppContext } from '../../App.js'
import { useNavigate } from "react-router-dom";
import { 
    MIN_PLAYERS, MAX_PLAYERS, MIN_ROBOTS, MAX_ROBOTS, DEFAULT_PLAYERS, DEFAULT_ROBOTS,
    MIN_GAMES, MAX_GAMES, DEFAULT_GAMES, PLAY_URL
} from './../../Globals.js'
import { generateId } from "../../utils";
import { Title, NumPlayers, NumGames, numGamesOption, PlayerName } from "../../components/index.js";
import { Player } from "../../services/index.js";
import './Params.css';

/**
 * Function Component for Params screen
 * @returns {React element} element to render
 */
 export default function Params() {

    const gameState = React.useContext(AppContext);

    const navigate = useNavigate();

    const oneGameTitle = 'One game shoot-out';
    const oneGameRadioId = generateId(oneGameTitle);
    const bestOfTitle = 'Best of';
    const bestOfRadioId = generateId(bestOfTitle);
    const bestOfSelectId = `${bestOfRadioId}-select`;

    // players state variable
    const [players, setPlayers] = useState({
        numPlayers: gameState.game.numPlayers,  // number of players
        array: gameState.game.getPlayers()      // array of player objects
    });
    // robots state variable
    const [robots, setRobots] = useState(gameState.game.numRobots);

    /**
     * Generate default player name
     * @param {number} index - player index
     * @returns {string} name
     */
    const defaultPlayerName = (index) => `Player ${index + 1}`;

    // https://bobbyhadz.com/blog/react-select-onchange

    /**
     * Set the number of players
     * @param {Event} event - HTMLElement: change event
     */
    const setNumPlayers = (event) => {
        let num = parseInt(event.target.value);
        if (num !== players.numPlayers){
            let array = players.array;
            if (num > array.length) {
                // add new player objects
                for (let index = array.length; index < num; index++) {
                    array.push(new Player(defaultPlayerName(index)))
                }
            } else if (num < array.length) {
                // remove excess player objects
                array = array.slice(0, num);
            }
            setPlayers({
                numPlayers: num,
                array: array
            });

            console.log(`numPlayers ${num}`);
        }
    };

    /**
     * Set the number of robots
     * @param {Event} event - HTMLElement: change event
     */
     const setNumRobots = (event) => {
        let numRobots = parseInt(event.target.value);
        setRobots(numRobots);
        console.log(`numRobots ${numRobots}`);
    };

    /** Set the maximum number of games */
    const selectedBestOf = () => gameState.bestOf = parseInt(
        document.getElementById(bestOfSelectId).value
    );

    /** Apply settings and start game */
    function playGame() {
        
        // TODO ensure unique player names
        
        players.array.forEach((player, index) => {
            let id = generatePlayerInputId(index);
            let name = document.getElementById(id).value;
            player.name = name ? name : defaultPlayerName(index);
        })

        gameState.game.init(players.numPlayers, robots, players.array);
        gameState.startGame();

        navigate(PLAY_URL);
    }

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

    // number of game options
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

    /**
     * Generate the id for a player name input element
     * @param {number} index 
     * @returns {string}
     */
    const generatePlayerInputId = (index) => `player-name-${index}`;

    /**
     * Generate player name elements 
     * @returns {Array}
     */
    function playerNames() {
        return players.array.map((x, index) => {
            let id = generatePlayerInputId(index);
            let divKey = `${id}-div-key`;
            let playerKey = `${id}-key`;
            return (
                <div className='div__player-name-wrapper' key={divKey}>
                    <PlayerName index={index + 1} id={id} key={playerKey} default={x.name} />
                </div>
            );
        });
    }

    return (
        <AppContext.Consumer>
            { value => 
                <main>
                    <Title />
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
                    <div className="div__player-names">
                        <div className="div__player-names-title">
                            <p>Name</p> 
                        </div>
                        {playerNames()}
                    </div>
                    <div className="div__play">
                        <button className='button__play' type='button' onClick={() => playGame()}>
                            Play
                        </button>
                    </div>
                </main>
            }
        </AppContext.Consumer>
    );
}