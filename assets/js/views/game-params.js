/**
    Game parameters view.
    @author Ian Buttimer
*/
import { 
    MIN_PLAYERS, MAX_PLAYERS, DEFAULT_PLAYERS, MIN_ROBOTS, MAX_ROBOTS, DEFAULT_ROBOTS,
    MIN_GAMES, DEFAULT_GAMES, MAX_GAMES, PLAY_URL, log 
} from '../globals.js';
import { Player } from '../player.js';
import { default as titleHeader } from '../components/title.js'
import { generateId, optionsList, accumulator } from '../utils/index.js';
import { View, setView } from '../routing.js'


// Parameters for game parameters
const numPlayersInfo = numPlayersParams('Number of players', MIN_PLAYERS, MAX_PLAYERS, DEFAULT_PLAYERS);
const numRobotsInfo = numPlayersParams('Number of robots', MIN_ROBOTS, MAX_ROBOTS, DEFAULT_ROBOTS);

const numPlayersId = generateId(numPlayersInfo.title);
const numRobotsId = generateId(numRobotsInfo.title);
const oneGameTitle = 'One game shoot-out';
const oneGameRadioId = generateId(oneGameTitle);
const bestOfTitle = 'Best of';
const bestOfRadioId = generateId(bestOfTitle);
const bestOfSelectId = `${bestOfRadioId}-select`;
const playButtonId = 'play-button';
const playerNameGroupId = 'player-name-group';

// number of game options
const numGameOptions = [
    numGamesParams(oneGameTitle, null, 1, oneGameRadioId),
    numGamesParams(
        bestOfTitle, 
        // odd numbers greater than 1 up to max inclusive
        [...Array((MAX_GAMES + 2) - MIN_GAMES + 1).keys()].filter(x => x > 1 && x % 2), 
        DEFAULT_GAMES !== 1 ? DEFAULT_GAMES : MIN_GAMES,
        bestOfRadioId,
        bestOfSelectId
    )
];

/** Working values for params */
let wip = {
    numPlayers: DEFAULT_PLAYERS,
    playerArray: [],
    numRobots: DEFAULT_ROBOTS
}

/**
 * Generate the game parameters view.
 * @param {GameState} gameState - game state object
 * @returns {string} html game parameters view
 */
export default function gameParamsView(gameState) {

    // set initial working values
    wip.numPlayers = gameState.game.numPlayers;
    wip.playerArray = gameState.game.getPlayers();
    wip.numRobots = gameState.game.numRobots;

    return `${titleHeader(gameState)}
            <div class="div__num-of-game-participants">
                ${getNumPlayers(numPlayersInfo)}
                ${getNumPlayers(numRobotsInfo)}
            </div>
            <div class="div__num-games-wrapper">
                ${getNumOfGames('num-of-games', DEFAULT_GAMES, numGameOptions)}
            </div>
            <div class="div__player-names">
                <div class="div__player-names-title">
                    <p>Name</p> 
                </div>
                <div class="div__player-name-group-wrapper" id=${playerNameGroupId}>
                    ${playerNames()}
                </div>
            </div>
            <div class="div__play">
                <button type='button' class='button__play' id=${playButtonId} aria-label="play game." rel="next">
                    Play
                </button>
            </div>`;
}

/** 
 * Apply settings and start game
 * @param {Event} event - HTMLElement: change event
 * @param {GameState} gameState - game state object
 */
function playGame(event, gameState) {
    
    persistPlayerNames();

    gameState.game.init(wip.numPlayers, wip.numRobots, wip.playerArray);
    gameState.startGame();

    setView(PLAY_URL, gameState);
}

/**
 * Save the entered player names
 * @returns {Array[Player]} player array
 */
function persistPlayerNames() {
    
    // TODO ensure unique player names
    
    wip.playerArray.forEach((player, index) => {
        let id = generatePlayerInputId(index + 1);
        let name = document.getElementById(id).value;
        player.name = name ? name : defaultPlayerName(index);
    })
    return wip.playerArray;
}

/**
 * Generate a number of players component parameters object
 * @param {string} title - label to display
 * @param {number} min - min number of players
 * @param {number} max - max number of players
 * @param {number} defaultValue - default number of players
 * @returns {object}
 */
 function numPlayersParams(title, min, max, defaultValue) {
    return {
        title: title,
        min: min,
        max: max,
        defaultValue: defaultValue
    }
}

/**
 * Generate a number of players selector.
 * @param {*} params - parameters object {@link numPlayersParams}
 * @returns {string} html for number of players selector
 */
function getNumPlayers(params) {
    const id = generateId(params.title);

    return `<div class="div__num-players-wrapper">
                <label for=${id}>${params.title}:</label>
                <select id=${id} name=${id}>
                    ${optionsList(
                            id,
                            [...Array(params.max - params.min + 1).keys()],
                            params.defaultValue,
                            x => x + params.min
                        )
                    }
                </select>
            </div>`
}

/**
 * Set the number of players
 * @param {Event} event - HTMLElement: change event
 */
function setNumPlayers(event) {
    let num = parseInt(event.target.value);
    if (num !== wip.numPlayers){
        let array = persistPlayerNames();
        if (num > array.length) {
            // add new player objects
            for (let index = array.length; index < num; index++) {
                array.push(new Player(`${defaultPlayerName(index)}`))
            }
        } else if (num < array.length) {
            // remove excess player objects
            array = array.slice(0, num);
        }

        wip.numPlayers = num;
        wip.playerArray = array;

        log(`numPlayers ${num}`);

        // update DOM
        const playerNameGroupElement = document.getElementById(playerNameGroupId);
        playerNameGroupElement.innerHTML = playerNames();
    }
}

/**
 * Set the number of robots
 * @param {Event} event - HTMLElement: change event
 */
function setNumRobots(event) {
    let numRobots = parseInt(event.target.value);
    wip.numRobots = numRobots;
    log(`numRobots ${numRobots}`);
};

/** Set the maximum number of games */
const selectedBestOf = (gameState) => gameState.bestOf = parseInt(
    document.getElementById(bestOfSelectId).value
);

/**
 * Generate a number of games parameters object
 * @param {string} title - label to display
 * @param {Array[number]} selections - array of selections
 * @param {number} optionDefault - default selection
 * @param {string} id - radio input id
 * @param {string} selectId - select input id
 */
 function numGamesParams(title, selections, optionDefault, id = null, selectId = null) {
    return {
        title: title, 
        selections: selections, 
        optionDefault: optionDefault,
        id: id,
        selectId: selectId
    }
}

/**
 * Generate a number of games radio input id
 * @param {object} option - parameters object {@link numGamesParams}
 * @return {string} id
 */
const generateRadioId = (option) => option.id ? option.id : generateId(option.title);

/**
 * Generate a number of games select input id
 * @param {object} option - parameters object {@link numGamesParams}
 * @param {string} id - radio input id
 * @param {number} index - index of number of games option
 * @return {string} id
 */
const generateSelectId = (option, id, index) => option.selectId ? option.selectId : `${id}-select-${index}`;

/**
 * Number of games component.
 * @param {string} group - group name
 * @param defaultValue - default number
 * @param {Array[object]} params - parameters object {@link numGamesParams}
 */
 function getNumOfGames(group, defaultValue, options) {

    /**
     * Generate selections list
     * @param {*Array} options - option parameter objects {@link numGamesParams}
     * @returns {string} html for selections list
     */
    function selectionsList() {
        return options.map((x, index) => {
                const id = generateRadioId(x);
                // check if default value is option's default
                const checked = defaultValue === x.optionDefault;

                let selectElement;
                if (x.selections) {
                    // a radio option with a select
                    let selectId = generateSelectId(x, id, index);
                    selectElement = `<select id=${selectId} name=${selectId} key=${selectId}>
                                        ${optionsList(selectId, x.selections)}
                                    </select>`;
                } else {
                    // no select, just a radio option
                    selectElement = '';
                }
                const radioInput = `<input type="radio" id=${id} key=${id} name=${group} value=${x.optionDefault} ${checked ? 'checked' : ''}/>
                                    <label for=${id}>
                                        ${x.title} ${selectElement}
                                    </label>`;

                return `${radioInput}`;
            }).reduce(accumulator, '');
    }
 
    return `${selectionsList()}`;
}

/**
 * Set the number of games.
 * @param {Event} event - HTMLElement: change event
 * @param {GameState} gameState - game state object
 */
function setNumGames(event, gameState) {
    if (event.target.id === oneGameRadioId) {
        if (event.target.checked) {
            gameState.bestOf = 1;
        }
    } else if (event.target.id === bestOfRadioId) {
        if (event.target.checked) {
            selectedBestOf(gameState);
        }
    } else if (event.target.id === bestOfSelectId) {
        document.getElementById(bestOfRadioId).checked = true;
        selectedBestOf(gameState);
    }
    log(gameState);
}

/**
 * Generate the id for a player name input element
 * @param {number} index 
 * @returns {string}
 */
const generatePlayerInputId = (index) => `player-name-${index}`;

/**
 * Generate default player name
 * @param {number} index - player index
 * @returns {string} name
 */
const defaultPlayerName = (index) => `Player ${index + 1}`;

/**
 * Generate player name elements 
 * @returns {string} html for player names inputs
 */
function playerNames() {
    return wip.playerArray
        .map((player, index) => getPlayerName(index + 1, player.name))
        .reduce(accumulator, '');
}

/**
 * Player name component.
 * @param {number} index - index of player
 * @param {string} defaultValue - default name
 * @returns {string} html for player name input
 */
 function getPlayerName(index, defaultValue) {

    const title = `Player ${index}`;

    let id = generatePlayerInputId(index);
    const divKey = `${id}-div-key`;
    const playerKey = `${id}-key`;

    return `<div class='div__player-name-wrapper' key=${divKey}>
                <label for="${id}">${title}:</label>
                <input type="text" id="${id}" key="${id}" name="${id}" value="${defaultValue}" />
            </div>`;
}

/**
 * Set handlers for game parameters
 * @param {GameState} gameState - game state object
 */
export function setParamsHandler(gameState) {
    [   // num games
        [numPlayersId, setNumPlayers],
        [numRobotsId, setNumRobots],
        // best of
        [oneGameRadioId, setNumGames],
        [bestOfRadioId, setNumGames],
        [bestOfSelectId, setNumGames],
    ].forEach(entry => {
        const element = document.getElementById(entry[0]);
        if (element) {
            element.addEventListener('change', (event) => entry[1](event, gameState), false)
            }
        }
    )

    const button = document.getElementById(playButtonId);
    if (button) {
        button.addEventListener('click', (event) => playGame(event, gameState), false);
    }
}
