/**
    Game progress component.
    @author Ian Buttimer
*/
import { accumulator, htmlTr, htmlTd, htmlSpan } from '../utils/index.js';

export const ORIENTATION_HORZ = 0;
export const ORIENTATION_VERT = 1;

/**
 * Get game play progress component
 * @param {Map} progress - match progress {@link GameState#progressMap()}
 * @returns {string} html for component
 */
 export default function gameProgress(progress) {
    return `<div class='div__game-progress-wrapper'>
                <table class='table__game-progress'>
                    <tbody>
                        ${getGameProgress(progress, ORIENTATION_HORZ)}
                    </tbody>
                </table>
            </div>`;
}

/**
 * Generate the progress rows
 * @param {Map} progress - round result {@link GameState#progressMap()}
 * @returns {string} html for component
 */
function getGameProgress(progress, orientation = ORIENTATION_HORZ) {

    let html;
    // default orientation horizontal; just one row
    let wrapInfo = (info) => { return info };
    let wrapAll = (info) => { return htmlTr(['tr__game-progress-row'], info) };
    if (orientation === ORIENTATION_VERT) {
        // orientation vertical; multiple rows
        const temp = wrapInfo;
        wrapInfo = wrapAll;
        wrapAll = temp;
    }

    return wrapAll(Array.from(progress).map((entry, index) => {
        const tdInfo = htmlTd(['td__game-progress-info'], 
                                    `${htmlSpan([], entry[0])}`);
        const tdData = htmlTd(['td__game-progress-data'], 
                                    `${htmlSpan([], entry[1])}`);
        return wrapInfo(`${tdInfo}
                         ${tdData}`);
    }).reduce(accumulator, ''));
}
