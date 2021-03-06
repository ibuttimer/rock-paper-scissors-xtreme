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
    htmlArticle, htmlH3, htmlI, ViewDetail
} from '../utils/index.js'
import { GameVariant, Rule } from '../game.js'
import { Selection } from '../enums.js'
import { setView } from '../routing.js'
import { GameKey } from '../enums.js';
import { bestOfOptions } from './game-params.js'


const basicHeadingId = 'basic-game-info';
const bigbangHeadingId = 'bigbang-game-info';
const xtremeHeadingId = 'xtreme-game-info';
const usingKeyboardId = 'using-keyboard-info';

htmlA([], BASIC_VARIANT_NAME, {
    id: basicHeadingId
})

const intro = htmlP([], 
`${GAME_NAME} is a ${htmlA([], 'zero sum game' , {
    href: "https://www.collinsdictionary.com/dictionary/english/zero-sum-game",
    target: "_blank",
    rel: "noopener",
    'aria-label': "visit zero sum game on collins dictionary site in another tab"
})} that is usually played by two people using their hands.
On this site, there are three different variations of the game available for play by multiple players, namely; 
${htmlA([], BASIC_VARIANT_NAME, {
    href: `#${basicHeadingId}`
})}, ${htmlA([], BIGBANG_VARIANT_NAME, {
    href: `#${bigbangHeadingId}`
})} and ${htmlA([], XTREME_VARIANT_NAME, {
    href: `#${xtremeHeadingId}`
})}.`);

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
                        (previousValue, currentValue) => `${previousValue}<br>${currentValue}`
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

/** Selection keys header */
const selectionKeysHeader = () => {
    return htmlThead(['thead__win-matrix'], htmlTr([], 
        ['Selection', 'Key']
            .map(hdr => `${htmlTh(['th__win-matrix'], hdr)}`)
            .reduce(accumulator, '')
        )
    )
};

/**
 * Generate the selection keys for the specified game variant
 * @param {GameVariant} variant 
 * @returns {string} html for component
 */
 const selectionKeysRows = (variant) => {
    const rules = variant.rules.concat([new Rule(Selection.Random)]);   // random key plus variant keys
    return htmlTbody([], rules.map(rule => {
        return htmlTr([], 
                `${htmlTd(tdClasses, rule.selection.name)}
                ${htmlTd(tdClasses, rule.selection.key.key.toUpperCase())}`
            );
        })
    );
};

/**
 * Generate the selection keys table for the specified game variant
 * @param {GameVariant} variant 
 * @returns {string} html for component
 */
export const selectionKeysTable = (variant) => htmlTable(['table__win-matrix'],
 `${selectionKeysHeader()}
 ${selectionKeysRows(variant)}`
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
    htmlButton(['button__play-variant', 'button__clickable', 'background-color__variant_basic', 'debossable'], 'Play Basic', {
                id: playBasicButtonId,
                'aria-label': 'play basic game.',
                value: BASIC_URL
            })
    );
// play big bang variant button
const playBigBangButtonId = 'play-bigbang-button';
const playBigBang = htmlDiv('div__play', 
    htmlButton(['button__play-variant', 'button__clickable', 'background-color__variant_bigbang', 'debossable'], 'Play Big Bang', {
                id: playBigBangButtonId,
                'aria-label': 'play big bang game.',
                value: BIGBANG_URL
            })
    );
// play xtreme variant button
const playXtremeButtonId = 'play-xtreme-button';
const playXtreme = htmlDiv('div__play', 
    htmlButton(['button__play-variant', 'button__clickable', 'background-color__variant_xtreme', 'debossable'], 'Play Xtreme', {
                id: playXtremeButtonId,
                'aria-label': 'play extreme game.',
                value: XTREME_URL
            })
    );

const keysItems = () => {
    return [
        'Round selections may be made by pressing the key corresponding to the selection, as specified in the game tables.',
        `If a player presses the '${htmlI([], GameKey.Random.key)}' key, a random selection is made for the round.`,
        `Pressing the '${htmlI([], 'Control')}' key on the Play screen, displays the keys for the possible selections.`,
        `Pressing the '${htmlI([], GameKey.Next.key.toUpperCase())}' key on the Round Results screen, continues the match.`
    ].map(rule => htmlLi([], rule))
    .reduce(accumulator, '');
};
const keysInfo = htmlP([], 
`Once a match has started, the following keys may be used to play:
${htmlUl(['ul__keys-info'], keysItems())}`);

const h3Heading = (innerHtml, attribs = {}) => htmlH3(['h3__rules-heading'], innerHtml, attribs)

/**
 * Get the rules view details.
 * @param {GameState} gameState - game state object
 * @returns {ViewDetail} view details
 */
 export default function gameRulesViewDetails(gameState) {

    return new ViewDetail(rulesViewHtml(gameState))
                .setEventHandlerSetter(setRulesHandler);
}

/**
 * Generate the rules view.
 * @param {GameState} gameState - game state object
 * @returns {string} html for view
 */
function rulesViewHtml(gameState) {
    return htmlArticle([], 
        `${h3Heading('Introduction')}
        ${intro}
        ${h3Heading('Common Rules')}
        ${commonRules}
        ${h3Heading(`${BASIC_VARIANT_NAME} variant`, {
            id: basicHeadingId
        })}
        ${basicRules}
        ${htmlDiv(['div__win-matrix'], basicWinMatrix())}
        ${playBasic}
        ${h3Heading(`${BIGBANG_VARIANT_NAME} variant`, {
            id: bigbangHeadingId
        })}
        ${bigBangRules}
        ${htmlDiv(['div__win-matrix'], bigBangWinMatrix())}
        ${playBigBang}
        ${h3Heading(`${XTREME_VARIANT_NAME} variant`, {
            id: xtremeHeadingId
        })}
        ${xtremeRules}
        ${htmlDiv(['div__win-matrix'], xtremeWinMatrix())}
        ${playXtreme}
        ${h3Heading(`Using the keyboard`, {
            id: usingKeyboardId
        })}
        ${keysInfo}`
    );
}

/**
 * Set handlers for rules
 * @param {GameState} gameState - game state object
 */
function setRulesHandler(gameState) {
    [playBasicButtonId, playBigBangButtonId, playXtremeButtonId].forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', (event) => setView(event.target.value, gameState), false);
        }
    });
}
