/**
    Leader board component.
    @author Ian Buttimer
*/
import { accumulator } from '../utils/index.js';

/**
 * Leader board component
 * @param {Array[object]} scores - array of player and score objects {@link GameState#topDownScores()}
 * @returns {string} html for component
 */
 export default function leaderBoard(scores) {
    return `<div class="div__leader-board-wrapper">
                <table class="table__leader-board">
                    <thead class="thead__leader-board">
                        <tr>
                            <th colSpan="2">Scores</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${getPlayerScores(scores)}
                    </tbody>
                </table>
            </div>`;
}

/**
 * Generate the player selections
 * @param {Array[object]} scores - array of player and score objects {@link GameState#topDownScores()}
 * @type {Player} player - player object
 * @type {number} score - player's score
 * @returns {string} html for component
 */
function getPlayerScores(scores) {

    return scores.map((playerScore, index) => {
        let rowKey = `player-score-row-${index}`;

        return `<tr class="tr__player-score-row" key=${rowKey}>
                    <td class="td__player-name">${playerScore.player.name}</td>
                    <td class="td__player-score">${playerScore.score}</td>
                </tr>`;
    }).reduce(accumulator, '');
}
