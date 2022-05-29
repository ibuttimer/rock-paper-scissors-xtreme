/*
  Test suite for game.js
 */
import { Contest, Rule, GameVariant, Game } from '../assets/js/game.js'
import { Selection, GameMode, RoundResult } from '../assets/js/enums.js'
import { getRequiredVariableMessage } from './utils.spec.js';

/* 
  Check Selection class
 */
describe("check Selection", function() {
    it("checks Selection()", function() {
        // check no name
        expect(function() {
            new Selection();
        })
        .toThrowError(getRequiredVariableMessage('name'));
    });

    it("checks Selection::getFinder(selection, accessor)", function() {
        // Search Selector object array
        // Selector object
        let selectionTarget = Selection.Paper;
        let target = selectionTarget;
        let array = [Selection.Rock, selectionTarget, Selection.Scissors];
        let finder = Selection.getFinder(target);
        expect(array.find(finder)).toBe(target);

        // Selector object name
        finder = Selection.getFinder(target.name);
        expect(array.find(finder)).toBe(target);

        // Selector object toString()
        finder = Selection.getFinder(target.toString());
        expect(array.find(finder)).toBe(target);

        // Search array of objects with Selector object property
        // Selector object
        let propertyName = 'property';
        array = array.map(x => 
        Object.fromEntries(new Map([
                [propertyName, x]
            ]))
        );
        target = array[Math.floor(array.length / 2)];
        let accessor = x => x[propertyName];
        finder = Selection.getFinder(selectionTarget, accessor);
        expect(array.find(finder)).toEqual(target);

        // Selector object name
        finder = Selection.getFinder(selectionTarget.name, accessor);
        expect(array.find(finder)).toEqual(target);

        // Selector object toString()
        finder = Selection.getFinder(selectionTarget.toString(), accessor);
        expect(array.find(finder)).toEqual(target);
    });
});
  
/* 
  Check Rule class
 */
describe("check Rule", function() {
    it("checks Rule::addContest(contest)", function() {
        // basic rock-scissors rule
        let rule = new Rule(Selection.Rock);
        expect(rule.contests.length).toBe(0);

        rule.addContest(Selection.Scissors);
        expect(rule.contests.length).toBe(1);
    });

    it("checks Rule::addContest(contest array)", function() {
        // rock-[scissors, paper] rule
        let rule = new Rule(Selection.Rock);
        expect(rule.contests.length).toBe(0);

        rule.addContest([Selection.Scissors, Selection.Paper]);
        expect(rule.contests.length).toBe(2);
    });

    it("checks Rule set contests", function() {
        // basic rock-scissors rule
        let rule = new Rule(Selection.Rock);
        expect(rule.contests.length).toBe(0);

        rule.contests = [Selection.Scissors];
        expect(rule.contests.length).toBe(1);
    });

    it("checks Rule.of(contest)", function() {
        // basic rock-scissors rule
        let rule = Rule.of(Selection.Rock, Contest.of(Selection.Rock, Selection.Scissors));
        expect(rule.contests.length).toBe(1);
    });

    it("checks Rule.of(contest array)", function() {
        // rock-[scissors, lizard] rule
        let rule = Rule.of(Selection.Rock, [
            Contest.of(Selection.Rock, Selection.Scissors, 'blunts'), 
            Contest.of(Selection.Rock, Selection.Lizard, 'crushes')
        ]);
        expect(rule.contests.length).toBe(2);
    });

    it("checks Rule::beats()", function() {
        // basic rock-scissors rule
        let rule = new Rule(Selection.Rock);
        expect(rule.contests.length).toBe(0);

        rule.addContest(Contest.of(Selection.Rock, Selection.Scissors, 'blunts'));
        expect(rule.contests.length).toBe(1);

        expect(rule.beats(Selection.Scissors)).toBe(true);
        expect(rule.beats(Selection.Paper)).toBe(false);
    });
});

/* 
  Check GameVariant statics
 */
describe("check GameVariant", function() {

    /**
     * Perform variant check
     * @param {GameVariant} gameVariant - GameVariant to check
     * @param {object} loserMap - map with Selection as key and list of losers as value
     * @param {Array} expectedPossibilities - list of possible selections
     */
    function rulesCheck(gameVariant, loserMap, expectedPossibilities) {
        let rules = gameVariant.rules;
        let possibleSelections = gameVariant.possibleSelections;

        expect(rules.length).toBe(expectedPossibilities.length);
        expect(possibleSelections).toEqual(expectedPossibilities);
        expect(gameVariant.numPossibleSelections).toEqual(expectedPossibilities.length);

        for (const rule of rules) {
            if (!loserMap.hasOwnProperty(rule.selection)) {
                throw new Error(`Unexpected selection: ${rule.selection}`);
            }
            let losers = loserMap[rule.selection];

            // check all possible selection values
            for (let selection of Object.keys(Selection)) {
                let loses;
                if (selection === rule.selection.name) {
                    loses = false;  // can't lose to itself
                } else {
                    // loses if in loser list
                    loses = losers.find(element => element.name === selection) !== undefined;
                }
                expect(rule.beats(selection))
                    .withContext(`${rule.selection} beats ${selection}`)
                    .toBe(loses);
            }
        }
    }

    it("checks GameVariant())", function() {
        // check no name
        expect(function() {
            new GameVariant();
        })
        .toThrowError(getRequiredVariableMessage('name'));

        // check duplicate rule
        let variant = new GameVariant('duplicate');
        const selection = Selection.Rock;
        variant.rules = [
            Rule.of(selection, [Contest.of(selection, Selection.Scissors)]),
            Rule.of(selection, [Contest.of(selection, Selection.Paper)])
        ];
        expect(function() {
            variant.finalise();
        })
        .toThrowError(`Rule already exists for ${selection}`);
    });

    it("checks GameVariant.Basic", function() {
        // see https://github.com/ibuttimer/rock-paper-scissors-xtreme/blob/main/design/design.md#basic-rules

        // note: expectedPossibilities order needs to match rules order
        let expectedPossibilities = [Selection.Rock, Selection.Paper, Selection.Scissors];

        let losers = {};
        losers[Selection.Rock] = [Selection.Scissors];
        losers[Selection.Paper] = [Selection.Rock];
        losers[Selection.Scissors] = [Selection.Paper];

        rulesCheck(GameVariant.Basic, losers, expectedPossibilities);
    });

    it("checks GameVariant.BigBang", function() {
        // see https://github.com/ibuttimer/rock-paper-scissors-xtreme/blob/main/design/design.md#big-bang-rules

        // note: expectedPossibilities order needs to match rules order
        let expectedPossibilities = [
            Selection.Rock, Selection.Paper, Selection.Scissors, Selection.Lizard, Selection.Spock
        ];

        let losers = {};
        losers[Selection.Rock] = [Selection.Scissors, Selection.Lizard];
        losers[Selection.Paper] = [Selection.Rock, Selection.Spock];
        losers[Selection.Scissors] = [Selection.Paper, Selection.Lizard];
        losers[Selection.Lizard] = [Selection.Paper, Selection.Spock];
        losers[Selection.Spock] = [Selection.Rock, Selection.Scissors];

        rulesCheck(GameVariant.BigBang, losers, expectedPossibilities);
    });

    it("checks GameVariant.Xtreme", function() {
        // see https://github.com/ibuttimer/rock-paper-scissors-xtreme/blob/main/design/design.md#xtreme-rules

        // note: expectedPossibilities order needs to match rules order
        let expectedPossibilities = [
            Selection.Rock, Selection.Paper, Selection.Scissors, Selection.Lizard, Selection.Spock, 
            Selection.Spiderman, Selection.Batman, Selection.Wizard, Selection.Glock
        ];

        let losers = {};
        losers[Selection.Rock] = [Selection.Scissors, Selection.Lizard, Selection.Spiderman, Selection.Wizard];
        losers[Selection.Paper] = [Selection.Rock, Selection.Spock, Selection.Batman, Selection.Glock];
        losers[Selection.Scissors] = [Selection.Paper, Selection.Lizard, Selection.Spiderman, Selection.Wizard];
        losers[Selection.Lizard] = [Selection.Paper, Selection.Spock, Selection.Batman, Selection.Glock];
        losers[Selection.Spock] = [Selection.Rock, Selection.Scissors, Selection.Spiderman, Selection.Wizard];
        losers[Selection.Spiderman] = [Selection.Paper, Selection.Lizard, Selection.Wizard, Selection.Glock];
        losers[Selection.Batman] = [Selection.Rock, Selection.Scissors, Selection.Spock, Selection.Spiderman];
        losers[Selection.Wizard] = [Selection.Paper, Selection.Lizard, Selection.Batman, Selection.Glock];
        losers[Selection.Glock] = [Selection.Rock, Selection.Scissors, Selection.Spock, Selection.Batman];

        rulesCheck(GameVariant.Xtreme, losers, expectedPossibilities);
    });
});

/* 
  Check Game class
 */
describe("check Game class", function() {

    /**
     * Check game
     * @param {Game} game - game to check
     * @param {number} numPlayers - number of players
     * @param {number} numRobots - number of robots
     * @param {number} activeCount - number of active players
     * @param {boolean} notStarted - not started state
     * @param {boolean} inProgress - in progress state
     * @param {boolean} isOver - is over state
     * @param {string} context - optional context; default undefined
     */
    function checkGame(game, numPlayers, numRobots, activeCount, notStarted, inProgress, isOver, context = undefined) {
        expect(game.playerCount).withContext(context).toBe(numPlayers + numRobots);
        expect(game.activePlayerCount).withContext(context).toBe(activeCount);
        expect(game.notStarted).withContext(context).toBe(notStarted);
        expect(game.inProgress).withContext(context).toBe(inProgress);
        expect(game.isOver).withContext(context).toBe(isOver);
    }

    /**
     * Makes a play for each player.
     * @param {GameVariant} variant - game variant
     * @param {Array} players - array of players
     * @param {function} picker - function taking index argument and returning a Selection 
     *                            or key associated with a Selection
     * @returns {object} player selection counts map with selection keys and count values
     */
    function makePlays(variant, players, picker) {
        let plays = variant.getCountsTemplate();
        for (let index = 0; index < players.length; index++) {
            const player = players[index];
            let selection = picker(index);
            if (selection !== Selection.None) {
                selection = player.setSelection(selection, GameMode.Test, variant);
                plays[selection]++;
            }
        }
        debugLog(plays, 'plays', false);
        return plays;
    }

    /**
     * Confirm game counts match played selections.
     * @param {object} counts - round counts map with selection keys and count values
     * @param {object} plays - player plays map with selection keys and count values
     * @param {string} context - optional context; default undefined
     */
    function confirmCounts(counts, plays, context = undefined) {
        for (let selection in plays) {
            expect(counts[selection]).withContext(context).toBe(plays[selection]);
        }
    }

    /**
     * Generate an elimination explanation regex.
     * @param {Selection} winningSelection - winning selection
     * @param {Selection} losingSelection  - losing selection
     * @returns {string} regex
     */
    function explanationRegex(winningSelection, losingSelection) {
        return `^${winningSelection.name}\\s+\\w+\\s+${losingSelection.name}.*`
    }

    /**
     * Log an object for debug purposes.
     * @param {object} object - object to log
     * @param {string} message - context message to log
     * @param {boolean} hasToString - object has toString() method flag
     */
    function debugLog(object, message = '', hasToString = true) {
        let str;
        if (hasToString) {
            str = object.toString();
        } else {
            str = '{';
            if (object instanceof Set) {
                for (let item of object) {
                    str += `${item}, `
                }
            }
                else {
                for (const key in object) {
                    if (Object.hasOwnProperty.call(object, key)) {
                        str += `${key}: ${object[key]}, `
                    }
                }
            }
            if (str.length > 2) {
                str = str.substring(0, str.length - 2);
            }
            str += '}';
        }
        if (message) {
            str = `${message}> ${str}`;
        }
        jasmine.debugLog(str);
    }

    /**
     * Perform basics checks on a game
     * @param {GameVariant} variant - variant to use for game
     * @param {number} numPayers - number of players
     * @param {number} numRobots - number of robots
     * @param {Game} game object
     */
    function checkVariant(variant, numPayers, numRobots) {
        const ALL_PLAYERS = numPayers + numRobots;

        const game = new Game(variant, numPayers, numRobots);
        game.gameMode = GameMode.Test;

        checkGame(game, numPayers, numRobots, 0, true, false, false);

        // start
        game.startGame();

        let expectedActive = ALL_PLAYERS;
        checkGame(game, numPayers, numRobots, expectedActive, false, true, false);

        // Check different selection each player, using keys
        let plays = makePlays(variant, game.players, function(index) {
            return variant.possibleSelections[index % expectedActive].key;
        });
        // confirm game counts match played selections
        confirmCounts(game.roundSelections(), plays, 'Using keys');
        // confirm play again result for round
        let evaluation = game.evaluateRound();
        expect(evaluation.result).toBe(RoundResult.PlayAgain);
        checkGame(game, numPayers, numRobots, expectedActive, false, true, false);

        // Check same selection each player
        plays = makePlays(variant, game.players, function(index) {
            return variant.possibleSelections[0];
        });
        // confirm game counts match played selections
        confirmCounts(game.roundSelections(), plays);
        // confirm play again result for round
        evaluation = game.evaluateRound();
        expect(evaluation.result).toBe(RoundResult.PlayAgain);
        checkGame(game, numPayers, numRobots, expectedActive, false, true, false);

        // Check all players except one make same selection, and other player makes losing selection
        let useRule = variant.rules[0];
        let playerIdx = 0;
        let selectedPlayer = game.players[playerIdx];
        let winningSelection = useRule.selection;
        let losingSelection = useRule.contests[0].loser;
        plays = makePlays(variant, game.players, function(index) {
            // selected player losing option, others winning option
            return (index === playerIdx ? losingSelection : winningSelection);
        });
        // confirm game counts match played selections
        confirmCounts(game.roundSelections(), plays);
        // confirm eliminate player result for round
        evaluation = game.evaluateRound();
        expect(evaluation.result).toBe(RoundResult.Eliminate);
        expect(evaluation.data).toEqual(useRule.contests);
        expect(evaluation.explanation.length).toBe(1);
        expect(evaluation.explanation[0])
            .toEqual(
                jasmine.stringMatching(
                    explanationRegex(winningSelection, losingSelection))
            );
        checkGame(game, numPayers, numRobots, expectedActive, false, true, false);
        // confirm eliminated one player
        --expectedActive;
        let processed = game.processEvaluation(evaluation);
        expect(processed.result).toBe(RoundResult.PlayAgain);
        expect(processed.data).toEqual([selectedPlayer]);
        checkGame(game, numPayers, numRobots, expectedActive, false, true, false);

        // Check one player makes winning selection
        useRule = variant.rules[variant.rules.length - 1];
        playerIdx = game.players.length - 1;
        selectedPlayer = game.players[playerIdx];
        winningSelection = useRule.selection;
        let selected = new Set();       // selections made in play
        let explanations = new Set();   // individual win explanations
        plays = makePlays(variant, game.players, function(index) {
            // none if player eliminated, else selected player winning option, others losing options
            let selection = Selection.None;
            if (game.players[index].inGame) {
                selection = (index === playerIdx ? 
                    winningSelection : useRule.contests[index % useRule.contests.length].loser);
                selected.add(selection);
            }
            return selection;
        });
        // find all win explanations
        for (const selection of selected) {
            const rule = variant.getRule(selection);
            for (const contest of rule.contests) {
                if (selected.has(contest.loser)) {
                    explanations.add(explanationRegex(selection, contest.loser));
                }
            }
        }
        // confirm game counts match played selections
        confirmCounts(game.roundSelections(), plays);
        // confirm eliminate player result for round
        evaluation = game.evaluateRound();

        debugLog(explanations, 'expected explanations');
        debugLog(evaluation, 'evaluation');

        expect(evaluation.result).toBe(RoundResult.Eliminate);
        expect(evaluation.data).toEqual(useRule.contests);
        expect(evaluation.explanation.length).toBe(explanations.size);
        for (let index = 0; index < evaluation.explanation.length; index++) {
            const reason = evaluation.explanation[index];
            let matched = false;
            for (const regex of explanations) {
                if (reason.match(regex)) {
                    matched = true;
                    break;
                }
            }
            expect(matched)
                .withContext(`Match reason ${reason}`)
                .toBeTrue();
        }
        checkGame(game, numPayers, numRobots, expectedActive, false, true, false);
        // confirm eliminated all player bar winner
        expectedActive = 1;
        processed = game.processEvaluation(evaluation);
        expect(processed.result).toBe(RoundResult.Winner);
        expect(processed.data).toBe(selectedPlayer);
        checkGame(game, numPayers, numRobots, expectedActive, false, true, false);

        // end
        game.endGame();
        checkGame(game, numPayers, numRobots, 0, false, false, true);

        return game;
    }

    it("checks Game()", function() {
        // Checking exception for a function with parameter is not supported in jasmine, so wrap in anonymous function
        expect(function() {
            new Game();
        })
        .toThrowError(getRequiredVariableMessage('variant'));
    });

    it("checks Game(Basic)", function() {
        const variant = GameVariant.Basic;
        const NUM_ROBOTS = 1;
        const NUM_PLAYERS = variant.numPossibleSelections - NUM_ROBOTS;
        const ALL_PLAYERS = NUM_PLAYERS + NUM_ROBOTS;

        const game = checkVariant(variant, NUM_PLAYERS, NUM_ROBOTS);
    });

    it("checks Game(BigBang)", function() {
        const variant = GameVariant.BigBang;
        const NUM_PLAYERS = variant.numPossibleSelections;
        const NUM_ROBOTS = 0;
        const ALL_PLAYERS = NUM_PLAYERS + NUM_ROBOTS;

        const game = checkVariant(variant, NUM_PLAYERS, NUM_ROBOTS);
    });

    it("checks Game(Xtreme)", function() {
        const variant = GameVariant.Xtreme;
        const NUM_PLAYERS = variant.numPossibleSelections;
        const NUM_ROBOTS = 0;
        const ALL_PLAYERS = NUM_PLAYERS + NUM_ROBOTS;

        const game = checkVariant(variant, NUM_PLAYERS, NUM_ROBOTS);
    });
});
  
