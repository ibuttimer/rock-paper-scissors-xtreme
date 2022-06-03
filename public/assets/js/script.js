import { GameVariant, Game } from './game.js';
import { GameKey } from './enums.js'


/* Wait for the DOM to finish loading before running the game
    as per Love Maths example project */

document.addEventListener("DOMContentLoaded", function() {

    // runGame();

});


let game;


// document.addEventListener('keydown', 
//     /**
//      * Keyboard event listener
//      * @param {KeyboardEvent} event - @see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent}
//      */
//     (event) => {
//         // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
//         const key = GameKey.keyEvent(event);

//         if (key === GameKey.NewGame) {
//             game.playGameBrowser();
//         } else if (game.roundInProgress && game.variant.isValidKey(key)) {
//             game.makePlayEvent(key);
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

    game = new Game(GameVariant.Basic, 2, 0, Game.OPT_CONSOLE);

    game.players.forEach(element => {
        console.log(element.name);
    });

    game.playGameEvents()
}
