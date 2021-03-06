/**
    Leader board component.
    @author Ian Buttimer
*/
import { 
    accumulator, htmlDiv, htmlTable, htmlThead, htmlTbody, htmlTr, htmlTh, htmlTd, htmlP 
} from '../utils/index.js';

export const ORIENTATION_HORZ = 0;
export const ORIENTATION_VERT = 1;

/**
 * Leader board component
 * @param {Array[object]} scores - array of player and score objects {@link GameState#topDownScores()}
 * @returns {string} html for component
 */
 export default function leaderBoard(scores) {
    return htmlDiv(['div__leader-board-wrapper'],
        htmlTable(['table__leader-board'], [
            htmlThead(['thead__leader-board'], 
                htmlTh([], 'Scores', {
                    colSpan: 2
                })),
            htmlTbody([], getPlayerScores(scores, ORIENTATION_VERT))
        ])
    );
}

/**
 * Generate the player selections
 * @param {Array[object]} scores - array of player and score objects {@link GameState#topDownScores()}
 * @type {Player} player - player object
 * @type {number} score - player's score
 * @returns {string} html for component
 */
function getPlayerScores(scores, orientation = ORIENTATION_HORZ) {

    // default orientation horizontal; just one row
    let wrapInfo = (info) => { return info };
    let wrapAll = (info) => { return htmlTr(['tr__player-score-row'], info) };
    if (orientation === ORIENTATION_VERT) {
        // orientation vertical; multiple rows
        const temp = wrapInfo;
        wrapInfo = wrapAll;
        wrapAll = temp;
    }

    return wrapAll(Array.from(scores).map((playerScore, index) => {
        const player = playerScore.player;
        const tdInfo = htmlTd(['td__player-name'], 
                                    htmlP([player.css.color], player.name));
        const tdData = htmlTd(['td__player-score'], 
                                    htmlP([], playerScore.score.toString()));
        return wrapInfo([tdInfo, tdData].join(' '));
    }).reduce(accumulator, ''));
}
