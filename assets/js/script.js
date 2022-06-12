/**
    Application entry point script.
    @author Ian Buttimer
*/
import { ENABLE_LOG, log } from './globals.js';
import { GameVariant, Game } from './game.js';
import { default as GameState } from './game-state.js';
import { GameKey } from './enums.js'
import { View, setView } from './routing.js'


/* Wait for the DOM to finish loading before running the game
    as per Love Maths example project */

document.addEventListener("DOMContentLoaded", function() {

    runGame();

});

let gameState;

/**
 * The main game "loop", called when the script is first loaded
 * and after the user's answer has been processed
 */
function runGame() {

    console.log('runGame');

    gameState = new GameState(
        new Game(GameVariant.Basic, 2, 0, ENABLE_LOG ? Game.OPT_CONSOLE: Game.OPT_NONE)
    )

    setView(View.GameMenu, gameState);
}

