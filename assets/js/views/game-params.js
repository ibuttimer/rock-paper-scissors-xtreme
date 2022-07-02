/**
    Game parameters view.
    @author Ian Buttimer
*/
import { 
    MIN_PLAYERS, MAX_PLAYERS, DEFAULT_PLAYERS, MIN_ROBOTS, MAX_ROBOTS, DEFAULT_ROBOTS,
    MIN_GAMES, DEFAULT_GAMES, MAX_GAMES, PLAY_URL, PLAYER_COLOURS
} from '../globals.js';
import { Player, Robot } from '../player.js';
import { default as titleHeader } from '../components/title.js'
import { 
    generateId, optionsList, accumulator, adjustArray, htmlH4, htmlSelect, htmlDiv, 
    htmlButton, htmlInput, htmlLabel, htmlP, log, ViewDetail, gameParticipantsCheck,
    replaceElementClass, htmlSpan
} from '../utils/index.js';
import { setView } from '../routing.js'
import { GameMode } from '../enums.js';


// Parameters for game parameters
const numPlayersInfo = (value) => numPlayersParams('Number of players', MIN_PLAYERS, MAX_PLAYERS, value);
const numRobotsInfo = (value) => numPlayersParams('Number of robots', MIN_ROBOTS, MAX_ROBOTS, value);

/**
 * Generate a number of games radio input id
 * @param {object} option - parameters object {@link numGamesParams}
 * @return {string} id
 */
 const generateRadioId = (option) => option.id ? option.id : `${generateId(option.title)}-radio`;

/**
 * Generate a number of games radio input label id
 * @param {string} radioId - radio input id
 * @return {string} id
 */
 const generateRadioLabelId = (radioId) => `${radioId}-label`;

 /**
  * Generate a number of games select input id
  * @param {object} option - parameters object {@link numGamesParams}
  * @param {string} id - radio input id
  * @param {number} index - index of number of games option
  * @return {string} id
  */
 const generateSelectId = (option, id, index) => option.selectId ? option.selectId : `${id}-select-${index}`;

const numPlayersId = generateId(numPlayersInfo(DEFAULT_PLAYERS).title);
const numRobotsId = generateId(numRobotsInfo(DEFAULT_ROBOTS).title);
const oneGameTitle = 'One game shoot-out';
const oneGameRadioId = generateRadioId({ title: oneGameTitle });
const oneGameRadioLabelId = generateRadioLabelId(oneGameRadioId);
const bestOfTitle = 'Best of';
const bestOfRadioId = generateRadioId({ title: bestOfTitle});
const bestOfRadioLabelId = generateRadioLabelId(bestOfRadioId);
const bestOfSelectId = generateSelectId({}, bestOfRadioId, 1);  // index 1 corresponds to 'best of' index in numGameOptions 
const playButtonId = 'play-button';
const playerNameGroupId = 'player-name-group';
const errorGroupId = 'error-group';

// odd numbers greater than 1 up to max inclusive
export const bestOfOptions = [...Array((MAX_GAMES + 2) - MIN_GAMES + 1).keys()].filter(x => x > 1 && x % 2);
// number of game options
const numGameOptions = [
    numGamesParams(oneGameTitle, null, 1, oneGameRadioId),
    numGamesParams(
        bestOfTitle, 
        // odd numbers greater than 1 up to max inclusive
        bestOfOptions, 
        DEFAULT_GAMES !== 1 ? DEFAULT_GAMES : MIN_GAMES,
        bestOfRadioId,
        bestOfSelectId
    )
];

export const COLOR_PROP = 'color';
export const TEXT_COLOR_PROP = 'text-color';
export const BACKGROUND_COLOR_PROP = 'background-color';
export const SELECTION_TILE_DIV_PROP = 'div__selection-tile-wrapper';
const PROPS = [COLOR_PROP, BACKGROUND_COLOR_PROP, SELECTION_TILE_DIV_PROP];


/** Working values for params */
let wip = {
    numPlayers: 0,
    playerArray: [],
    numRobots: 0,
    bestOf: 0,
    gameMode: GameMode.Live
}

/**
 * Get the game params view details.
 * @param {GameState} gameState - game state object
 * @returns {ViewDetail} view details
 */
 export default function gameParamsViewDetails(gameState) {

    return new ViewDetail(gameParamsViewHtml(gameState))
                .setEventHandlerSetter(setParamsHandler);
}

/**
 * Generate the game parameters view.
 * @param {GameState} gameState - game state object
 * @returns {string} html game parameters view
 */
function gameParamsViewHtml(gameState) {

    // set initial working values
    wip.numPlayers = gameState.game.numPlayers;
    wip.playerArray = gameState.game.getPlayers();
    wip.numRobots = gameState.game.numRobots;
    wip.bestOf = gameState.bestOf;
    wip.gameMode = gameState.game.gameMode;

    return `${titleHeader(gameState)}
            ${htmlDiv('div__num-of-game-participants', 
                `${getNumPlayers(numPlayersInfo(wip.numPlayers))}
                ${getNumPlayers(numRobotsInfo(wip.numRobots))}`
            )}
            ${htmlDiv('div__num-games-wrapper', 
                getNumOfGames('num-of-games', wip.bestOf, numGameOptions)
            )}
            ${htmlDiv('div__player-names', 
                `${htmlDiv('div__player-name-wrapper', 
                    `${htmlDiv('div__player-names-title', 
                        htmlP([], 'Enter player names'))}`
                )}
                ${htmlDiv('div__player-name-group-wrapper', playerNames(wip.playerArray), {
                    id: playerNameGroupId
                })}
                ${htmlDiv('div__param-errors-hidden', '', {
                    id: errorGroupId
                })}`
            )}
            ${htmlDiv('div__play', playButton(false))}`;
}

/** 
 * Apply settings and start game
 * @param {Event} event - HTMLElement: change event
 * @param {GameState} gameState - game state object
 * @param {boolean} setPlayView - set the play view; default true
 */
export function playGame(event, gameState, setPlayView = true) {

    const playerCheck = persistPlayerNames(wip.playerArray);
    if (playerCheck.ok) {
        // generate player list
        const robots = wip.numRobots ? 
            [...Array(wip.numRobots).keys()].map(index => new Robot(index + 1)) : [];
        const players = playerCheck.players.concat(robots);

        // set player specific css
        players.forEach((player, index) => {
            player.css = {};
            PROPS.forEach(prop => player.css[prop] = playerCss(index, prop));
            player.colour = PLAYER_COLOURS[index];
        })

        gameState.bestOf = wip.bestOf;
        gameState.game.init(wip.numPlayers, wip.numRobots, players);
        gameState.startMatch();

        if (setPlayView) {
            setView(PLAY_URL, gameState);
        }
    } else {
        // re-display players with errors
        displayCheckResult(playerCheck);
    }
}

/**
 * Save the entered player names and check for param errors
 * @param {Array[Player]} array - array of players
 * @returns {object} result object with the following properties:
 * @type {boolean} ok - player names ok flag
 * @type {Array[Player]} players - array of players
 * @type {Array[number]} duplicates - array of indices with duplicate names
 * @type {Array[string]} errors - array of error messages
 */
function persistPlayerNames(array) {
    
    const duplicates = new Map();   // map with name as key and array of indices as value
    let areUnique = true;

    // determine indices for each entered name
    array.forEach((player, index) => {
        const id = generatePlayerInputId(playerIndexToIdNum(index));
        const element = document.getElementById(id);
        const name = element ? element.value : undefined;
        player.name = name ? name : defaultPlayerName(index);

        if (!duplicates.has(player.name)) {
            duplicates.set(player.name, [index]);
        } else {
            areUnique = false;
            duplicates.get(player.name).push(index);
        }
    });

    let errors = [];  // error messages
    let indices = [];   // array of indices with duplicate names
    if (!areUnique) {
        // remove non duplicate entries from map
        let notDuplicate = [];
        duplicates.forEach(function(value, key) {
            if (value.length === 1) {
                notDuplicate.push(key);
            }
        });
        notDuplicate.forEach(key => duplicates.delete(key));

        duplicates.forEach(function(value, key) {
            indices = indices.concat(value);
        })

        errors.push('Duplicate player names identified! Please specify unique player names.');
    }

    const participantsCheck = gameParticipantsCheck(wip.numPlayers, wip.numRobots);
    if (participantsCheck) {
        errors = errors.concat(participantsCheck);
    }

    return { 
        ok: areUnique && errors.length === 0,
        players: array,
        duplicates: indices,
        errors: errors
    };
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

    return htmlDiv(['div__num-players-wrapper'],
            htmlLabel(['style__param-input', 'style__param-input-left'], `${params.title}:`, {
                for: id
            }) +
            htmlSelect(['style__param-input', 'style__param-input-right'], optionsList(
                id,
                [...Array(params.max - params.min + 1).keys()],
                params.defaultValue,
                x => x + params.min
            ), {
                id: id,
                name: id
            })
        );
}

/**
 * Set the number of players
 * @param {Event|number} event - HTMLElement: change event or number of players
 */
 function setNumPlayers(event) {
    let num = event;
    if (typeof event !== 'number') {
        num = parseInt(event.target.value);
    }
    if (num !== wip.numPlayers) {
        participantsCheck(num, wip.numRobots);
    }
}

/**
 * Set the number of players
 * @param {Event|number} event - HTMLElement: change event or number of players
 */
 function participantsCheck(numPlayers, numRobots) {
    let array = wip.playerArray;
    if (numPlayers != wip.numPlayers) {
        array = adjustArray(
            wip.playerArray, numPlayers, (index) => {
                return new Player(`${defaultPlayerName(index)}`);
            });
        wip.playerArray = array;

        wip.numPlayers = numPlayers;
        log(`numPlayers ${numPlayers}`);
    }
    if (numRobots !== wip.numRobots) {

        wip.numRobots = numRobots;
        log(`numRobots ${numRobots}`);
    }

    const playerCheck = persistPlayerNames(array);

    // update DOM
    displayCheckResult(playerCheck)
}

/**
 * Display the player name inputs 
 * @param {Array[Player]} array - array of players
 * @param {Array[number]} errorIndices - array of indices of player with error
 */
 function displayPlayers(array, errorIndices) {
    const playerNameGroupElement = document.getElementById(playerNameGroupId);
    playerNameGroupElement.innerHTML = playerNames(array, errorIndices);
}

/**
 * Display a params check result
 * @param {object} playerCheck - object returned from {@link persistPlayerNames}
 */
function displayCheckResult(playerCheck) {
    // update DOM
    if (wip.gameMode !== GameMode.Demo){
        displayPlayers(wip.playerArray, playerCheck.duplicates);
        showErrors(playerCheck.errors);
    }
}

/**
 * Set the number of robots
 * @param {Event|number} event - HTMLElement: change event or number of robots
 */
function setNumRobots(event) {
    let num = event;
    if (typeof event !== 'number') {
        num = parseInt(event.target.value);
    }
    if (num !== wip.numRobots) {
        participantsCheck(wip.numPlayers, num);
    }
}

/** Set the maximum number of games */
const selectedBestOf = () => wip.bestOf = parseInt(
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
 * Number of games component.
 * @param {string} group - group name
 * @param {number} defaultValue - default number
 * @param {Array[object]} options - parameters object {@link numGamesParams}
 */
 function getNumOfGames(group, defaultValue, options) {

    /**
     * Generate selections list
     * @param {Array[object]} options - option parameter objects {@link numGamesParams}
     * @returns {string} html for selections list
     */
    function selectionsList() {
        return options.map((opt, index) => {
                const radioId = generateRadioId(opt);
                // check if default value is option's default
                let checked = defaultValue === opt.optionDefault;

                if (!checked && opt.selections) {
                    // check if defaultValue is one of the options
                    opt.selections.forEach(sel => {
                        if (sel === defaultValue) {
                            checked = true;
                        }
                    });
                }

                let selectId = generateSelectId(opt, radioId, index);
                let selectElement;
                if (opt.selections) {
                    // a radio option with a select
                    selectId = generateSelectId(opt, radioId, index);

                    selectElement = htmlSelect(['style__param-input'], optionsList(selectId, opt.selections, defaultValue), {
                        id: selectId,
                        name: selectId,
                        'aria-label': getNumOfGamesAriaLabel(selectId)
                    });
                } else {
                    // no select, just a radio option
                    selectId = radioId;
                    selectElement = '';
                }
                const radioInput = htmlInput([], {
                                    type: 'radio',
                                    id: radioId,
                                    name: group,
                                    value: opt.optionDefault,
                                    checked: checked
                                });
                const labelId = generateRadioLabelId(radioId);

                return radioInput +
                        htmlLabel(['style__param-input'], opt.title, { 
                            for: radioId,
                            id: labelId,
                            'aria-label': getNumOfGamesAriaLabel(labelId)
                        }) + 
                        selectElement;
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
            wip.bestOf = 1;
        }
    } else if (event.target.id === bestOfRadioId) {
        if (event.target.checked) {
            selectedBestOf();
        }
    } else if (event.target.id === bestOfSelectId) {
        document.getElementById(bestOfRadioId).checked = true;
        selectedBestOf();
    }

    [oneGameRadioLabelId, bestOfRadioLabelId, bestOfSelectId].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute('aria-label', getNumOfGamesAriaLabel(id));
        }
    });

    log(gameState);
}

/**
 * Set the game parameters in demo mode.
 * @param {number} numPlayers - number of players
 * @param {number} numRobots - number of robots
 * @param {number} numGames - number of robots
 */
export function setParamsOverride(numPlayers, numRobots, numGames) {
    wip.gameMode = GameMode.Demo;

    setNumPlayers(numPlayers);
    setNumRobots(numRobots);
    wip.bestOf = numGames;
}

/**
 * Get aria label for number of games input label
 * @param {string} id - id of label
 * @returns {string}
 */
function getNumOfGamesAriaLabel(id) {
    let title;
    let selected;
    if (id == oneGameRadioLabelId) {
        title = 'One game shoot-out option';
        selected = wip.bestOf === 1;
    } else if (id === bestOfRadioLabelId) {
        title = 'Best of multiple games option';
        selected = wip.bestOf > 1;
    } else {
        title = 'Best of multiple games setter';
        selected = wip.bestOf > 1;
    }
    return `${title}, ${selected ? 'selected' : 'not selected'}, number of games ${wip.bestOf}.`;
}

/**
 * Generate the id for a player name input element
 * @param {number} index 
 * @returns {string}
 */
const generatePlayerInputId = (index) => `player-name-${index}`;

/**
 * Convert zero-based player index to player id number
 * @param {number} index 
 * @returns {number}
 */
const playerIndexToIdNum = (index) => { return index + 1 };

/**
 * Convert one-based player id number to player index
 * @param {number} idNum 
 * @returns {number}
 */
 const playerIdNumToIndex = (idNum) => { return idNum - 1 };
 
 /**
 * Generate default player name
 * @param {number} index - player index
 * @returns {string} name
 */
const defaultPlayerName = (index) => `Player ${playerIndexToIdNum(index)}`;

const errorLabel = htmlSpan(['span__label-error'], ' *');
const noErrorLabel = htmlSpan(['span__label-no-error'], ' *');

/**
 * Generate player name elements 
 * @param {Array[Player]} playerArray - array of players
 * @param {Array[number]} errorIndices - array of indices of player with error
 * @returns {string} html for player names inputs
 */
function playerNames(playerArray, errorIndices) {

    let params;
    if (errorIndices && errorIndices.length > 0) {
        params = (index) => {
            let playerClasses = undefined;
            let label = noErrorLabel;
            if (errorIndices.findIndex(idx => idx === index) >= 0) {
                playerClasses = ['div__border-error'];
                label = errorLabel;
            }
            return {
                classes: playerClasses,
                label: label
            }
        }
    } else {
        params = (index) => { return { label: noErrorLabel }; }
    }
    return playerArray
        .map((player, index) => getPlayerName(playerIndexToIdNum(index), player.name, params(index)))
        .reduce(accumulator, '');
}

/**
 * Shows parameter errors
 * @param {string|Array[string]} errors - list of errors
 */
function showErrors(errors) {
    const element = document.getElementById(errorGroupId);
    let toSet;
    let toRemove;
    if (errors) {
        toSet = 'div__param-errors';
        toRemove = 'div__param-errors-hidden';

        if (typeof errors === 'string') {
            errors = [errors];
        }
        element.innerHTML = errors.map(error => htmlH4([], error))
                .reduce(accumulator, '');
    } else {
        toSet = 'div__param-errors-hidden';
        toRemove = 'div__param-errors';
    }
    replaceElementClass(element, toRemove, toSet);
}

/**
 * Generate html for the play button
 * @param {boolean} disabled - disabled flag
 * @returns {string}
 */
function playButton(disabled) {
    return htmlButton(['button__play', 'button__clickable', 'debossable'], 'Play', {
        id: playButtonId,
        'aria-label': 'play game.',
        disabled: disabled
    });
}

/**
 * Generate the css class for the specified player index and property
 * @param {number} index - player index 
 * @param {string} property - css property
 * @returns {string} css class
 */
 const playerCss = (index, property) => {
    const idNum = playerIndexToIdNum(index);
    let cssClass;
    switch (property) {
        case COLOR_PROP:
            cssClass = `color_${idNum}`;
            break;
        case TEXT_COLOR_PROP:
            cssClass = `color_${idNum}_text`;
            break;
        case BACKGROUND_COLOR_PROP:
            cssClass = `background-color_${idNum}`;
            break;
        case SELECTION_TILE_DIV_PROP:
            cssClass = `div__selection-tile-wrapper-${idNum}`;
            break;
        default:
            throw new Error(`Unknown property: ${property}`);
    }
    return cssClass;
}

/**
 * Player name component.
 * @param {number} idNum - player id number
 * @param {string} defaultValue - default name
 * @param {object} params - additional parameters object of the form
 * 
 *  @type {Array[string]} classes - additional css classes
 *  @type {string} label - label addendum
 * 
 * @returns {string} html for player name input
 */
 function getPlayerName(idNum, defaultValue, params) {

    let title = `Player ${idNum}`;
    if (params && params.hasOwnProperty('label') && params.label) {
        title = `${title}${params.label}`;
    }

    const id = generatePlayerInputId(idNum);
    const playerIndex = playerIdNumToIndex(idNum);
    const colorCss = playerCss(playerIndex, TEXT_COLOR_PROP);
    const backgroundCss = playerCss(playerIndex, BACKGROUND_COLOR_PROP);

    let inputClasses = ['input__player-name', backgroundCss, colorCss];
    if (params && params.hasOwnProperty('classes') && params.classes) {
        inputClasses = inputClasses.concat(
            Array.isArray(params.classes) ? params.classes : [params.classes]);
    }

    return htmlDiv(['div__player-name-wrapper'], [
        htmlLabel([], title, {
            for: id
        }),
        htmlDiv(['div__player-name-input'], [
            htmlInput(inputClasses, {
                type: 'text',
                id: id,
                name: id, value: defaultValue
            })
        ])
    ]);
}

/**
 * Set handlers for game parameters
 * @param {GameState} gameState - game state object
 */
function setParamsHandler(gameState) {
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
