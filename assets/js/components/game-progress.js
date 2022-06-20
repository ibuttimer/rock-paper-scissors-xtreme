/**
    Game progress component.
    @author Ian Buttimer
*/
import { accumulator, htmlDiv, htmlTable, htmlTbody, htmlTr, htmlTd, htmlSpan } from '../utils/index.js';

/**
 * Get game play progress component
 * @param {Map} progress - match progress {@link GameState#progressMap()}
 * @returns {string} html for component
 */
 export default function gameProgress(progress) {
    return htmlDiv(['div__game-progress-wrapper'],
            htmlTbody([], getGameProgress(progress))
    );
}

/**
 * Generate the progress rows
 * @param {Map} progress - round result {@link GameState#progressMap()}
 * @returns {string} html for component
 */
function getGameProgress(progress) {

    return Array.from(progress).map((entry, index) => {
        const tdInfo = htmlDiv(['div__game-progress-info'], 
                                    htmlSpan([], entry[0]));
        const tdData = htmlDiv(['div__game-progress-data'], 
                                    htmlSpan([], entry[1]));
        return htmlDiv(['div__game-progress-entry'], [tdInfo, tdData].join(' '));
    }).reduce(accumulator, '');
}