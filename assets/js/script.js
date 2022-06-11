import { ENABLE_LOG, log } from './globals.js';
import { GameVariant, Game } from './game.js';
import { default as GameState } from './game-state.js';
import { GameKey } from './enums.js'
import { View, setView } from './views.js'


/* Wait for the DOM to finish loading before running the game
    as per Love Maths example project */

document.addEventListener("DOMContentLoaded", function() {

    runGame();

});

let gameState;

// TODO enable when actually playing game
// document.addEventListener('keydown', 
//     /**
//      * Keyboard event listener
//      * @param {KeyboardEvent} event - @see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent}
//      */
//     (event) => {
//         // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
//         const key = GameKey.keyEvent(event);

//         if (key === GameKey.NewGame) {
//             gameState.game.playGameBrowser();
//         } else if (gameState.game.roundInProgress && game.variant.isValidKey(key)) {
//             gameState.game.makePlayEvent(key);
//         } else {
//             // TODO audio feedback
//         }
//     }, false);

/**
 * The main game "loop", called when the script is first loaded
 * and after the user's answer has been processed
 */
function runGame() {

    console.log('runGame');

    gameState = new GameState(
        new Game(GameVariant.Basic, 2, 0, ENABLE_LOG ? Game.OPT_CONSOLE: Game.OPT_NONE)
    )

    gameState.startGame();

    setView(View.GameMenu, gameState);

}

