import { GameVariant, Game } from './game.js';


/* Wait for the DOM to finish loading before running the game
    as per Love Maths example project */

document.addEventListener("DOMContentLoaded", function() {

    runGame();

});


/**
 * The main game "loop", called when the script is first loaded
 * and after the user's answer has been processed
 */
function runGame() {

    let game = new Game(GameVariant.Basic, 2, 3);

    game.players.forEach(element => {
        console.log(element.name);
    });

}
