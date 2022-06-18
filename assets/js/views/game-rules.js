/**
    Rules view.
    @author Ian Buttimer
*/
import { 
    GAME_NAME, BASIC_VARIANT_NAME, BIGBANG_VARIANT_NAME, XTREME_VARIANT_NAME,
    BASIC_URL, BIGBANG_URL, XTREME_URL, MIN_PARTICIPANTS, MAX_PARTICIPANTS,
    MIN_PLAYERS, MAX_PLAYERS, MAX_ROBOTS, MIN_GAMES
} from '../globals.js'
import { 
    htmlP, htmlA, htmlLi, htmlUl, accumulator, htmlDiv, htmlButton,
    htmlTable, htmlThead, htmlTbody, htmlTh, htmlTr, htmlTd, 
    htmlArticle, htmlH3, htmlI
} from '../utils/index.js'
import { GameVariant } from '../game.js'
import { setView } from '../routing.js'
import { GameKey } from '../enums.js';
import { bestOfOptions } from './game-params.js'


const intro = htmlP([], 
`${GAME_NAME} is a ${htmlA([], 'zero sum game' , {
    href: "https://www.collinsdictionary.com/dictionary/english/zero-sum-game",
    target: "_blank",
    rel: "noopener",
    'aria-label': "visit collins dictionary in another tab"
})} that is usually played by two people using their hands.
On this site, there are three different variations of the game available for play by multiple players, namely; ${BASIC_VARIANT_NAME}, ${BIGBANG_VARIANT_NAME} and ${XTREME_VARIANT_NAME}.`);

/** 'Best of' options as a string */
const bestOfPossibilities = () => {
    return bestOfOptions.map(opt => opt.toString())
        .reduce(
            (previousValue, currentValue, currentIndex, array) => 
                previousValue + 
                (currentIndex > 0 && currentIndex < array.length - 1 ? ', ' : (currentIndex > 0 ? ' or ' : '')) +
                currentValue, 
            ''
        );
};
const commonRulesItems = () => {
    return [
        `A match consists of a minimum of ${MIN_PARTICIPANTS} players, at least ${MIN_PLAYERS} of which must be a physical player.`,
        `The maximum number of players in a match is ${MAX_PARTICIPANTS}, with at most ${MAX_PLAYERS} physical players and ${MAX_ROBOTS} robots.`,
        `A match may be decided by ${MIN_GAMES} game, or the best of ${bestOfPossibilities()} games.`,
        'Each player must make one selection per round. A selection may be made by clicking the appropriate selection tile, or pressing the key corresponding to the selection.',
        `If a player presses the '${htmlI([], GameKey.Random.key)}' key, a random selection is made for the round.`,
        'Once every player has made a selection, the results are evaluated and any losing players are eliminated from the game.',
        'All remaining players, proceed to the next round to make a new selection.',
        'In the event that all possible selections were made, all players proceed to the next round.',
        'The game continues until only one player remains.'
    ].map(rule => htmlLi([], rule))
    .reduce(accumulator, '');
};
const commonRules = htmlP([], 
`The following rules are common to all variations of the game:
${htmlUl(['ul__common-rules'], commonRulesItems())}`);

const selectionItems = (variant) => variant.possibleSelections.map(sel => sel.name);
const selectionItemsList = (variant) => {
    return selectionItems(variant)
        .reduce(
            (previousValue, currentValue, currentIndex, array) => 
                previousValue + 
                (currentIndex > 0 && currentIndex < array.length - 1 ? ', ' : (currentIndex > 0 ? ' and ' : '')) +
                currentValue, 
            ''
            );
};

// basic variant rules
const basicRules = htmlP([], 
`The ${BASIC_VARIANT_NAME} variant has ${GameVariant.Basic.numPossibleSelections} possible selections; ${selectionItemsList(GameVariant.Basic)}.`);
// big bang variant rules
const bigBangRules = htmlP([], 
    `The ${BIGBANG_VARIANT_NAME} variant has ${GameVariant.BigBang.numPossibleSelections} possible selections; ${selectionItemsList(GameVariant.BigBang)}.`);
// xtreme variant rules
const xtremeRules = htmlP([], 
    `The ${XTREME_VARIANT_NAME} variant has ${GameVariant.Xtreme.numPossibleSelections} possible selections; ${selectionItemsList(GameVariant.Xtreme)}.`);
            
/** Win matrix header */
const winMatrixHeader = () => {
    return htmlThead(['thead__win-matrix'], htmlTr([], 
        ['Selection', 'Win reason', 'Key']
            .map(hdr => `${htmlTh(['th__win-matrix'], hdr)}`)
            .reduce(accumulator, '')
        )
    )
};

const tdClasses = ['td__win-matrix'];

/**
 * Generate the win matrix rows for the specified game variant
 * @param {GameVariant} variant 
 * @returns {string} html for component
 */
 const winMatrixRows = (variant) => {
    return htmlTbody([], variant.rules.map(rule => {
        return htmlTr([], 
                `${htmlTd(tdClasses, rule.selection.name)}
                ${htmlTd(tdClasses, rule.contests
                    .map(contest => contest.explanation)
                    .reduce(
                        (previousValue, currentValue) => `${previousValue}, ${currentValue}`
                    )
                )}
                ${htmlTd(tdClasses, rule.selection.key.key.toUpperCase())}`
            );
        })
    );
};

/**
 * Generate a win matrix for the specified game variant
 * @param {GameVariant} variant 
 * @returns {string} html for component
 */
const winMatrix = (variant) => htmlTable(['table__win-matrix'],
    `${winMatrixHeader()}
    ${winMatrixRows(variant)}`
);

// basic variant win matrix
const basicWinMatrix = () => winMatrix(GameVariant.Basic);
// big bang variant win matrix
const bigBangWinMatrix = () => winMatrix(GameVariant.BigBang);
// xtreme variant win matrix
const xtremeWinMatrix = () => winMatrix(GameVariant.Xtreme);

// play basic variant button
const playBasicButtonId = 'play-basic-button';
const playBasic = htmlDiv('div__play', 
    htmlButton(['button__play', 'button__clickable', 'background-color__variant_basic', 'debossable'], 'Play Basic', {
                id: playBasicButtonId,
                'aria-label': 'play basic game.',
                value: BASIC_URL
            })
    );
// play big bang variant button
const playBigBangButtonId = 'play-bigbang-button';
const playBigBang = htmlDiv('div__play', 
    htmlButton(['button__play', 'button__clickable', 'background-color__variant_bigbang', 'debossable'], 'Play Big Bang', {
                id: playBigBangButtonId,
                'aria-label': 'play basic game.',
                value: BIGBANG_URL
            })
    );
// play xtreme variant button
const playXtremeButtonId = 'play-xtreme-button';
const playXtreme = htmlDiv('div__play', 
    htmlButton(['button__play', 'button__clickable', 'background-color__variant_xtreme', 'debossable'], 'Play Xtreme', {
                id: playXtremeButtonId,
                'aria-label': 'play basic game.',
                value: XTREME_URL
            })
    );


const h3Heading = (innerHtml, attribs = {}) => htmlH3(['h3__rules-heading'], innerHtml, attribs)

/**
 * Generate the rules view.
 * @param {GameState} gameState - game state object
 * @returns {string} html for view
 */
 export default function rulesView(gameState) {
    return htmlArticle([], 
        `${h3Heading('Introduction')}
        ${intro}
        ${h3Heading('Common Rules')}
        ${commonRules}
        ${h3Heading(`${BASIC_VARIANT_NAME}`)}
        ${basicRules}
        ${htmlDiv(['div__win-matrix'], basicWinMatrix())}
        ${playBasic}
        ${h3Heading(`${BIGBANG_VARIANT_NAME}`)}
        ${bigBangRules}
        ${htmlDiv(['div__win-matrix'], bigBangWinMatrix())}
        ${playBigBang}
        ${h3Heading(`${XTREME_VARIANT_NAME}`)}
        ${xtremeRules}
        ${htmlDiv(['div__win-matrix'], xtremeWinMatrix())}
        ${playXtreme}
        `
    );
}

/**
 * Set handlers for rules
 * @param {GameState} gameState - game state object
 */
 export function setRulesHandler(gameState) {
    [playBasicButtonId, playBigBangButtonId, playXtremeButtonId].forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', (event) => setView(event.target.value, gameState), false);
        }
    });
}
