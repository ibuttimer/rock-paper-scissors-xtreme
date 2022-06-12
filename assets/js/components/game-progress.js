/**
    Game progress component.
    @author Ian Buttimer
*/
import { accumulator } from '../utils/index.js';

/**
 * Get game play progress component
 * @param {Map} progress - match progress {@link GameState#progressMap()}
 * @returns {string} html for component
 */
 export default function gameProgress(progress) {
    return `<div class='div__game-progress-wrapper'>
                <table class='table__game-progress'>
                    <tbody>
                        ${getGameProgress(progress)}
                    </tbody>
                </table>
            </div>`;
}

/**
 * Generate the progress rows
 * @param {Map} progress - round result {@link GameState#progressMap()}
 * @returns {string} html for component
 */
function getGameProgress(progress) {

    return Array.from(progress).map((entry, index) => {
        let rowKey = `game-progress-row-${index}`;

        return `<tr class='tr__game-progress-row' key=${rowKey}>
                    <td class='td__game-progress-info'>${entry[0]}</td>
                    <td class='td__game-progress-data'>${entry[1]}</td>
                </tr>`;
    }).reduce(accumulator, '');
}
