/*
  Test suite for game.js
 */
import { Contest, Rule, GameVariant, Game, GameResult } from '../assets/js/game.js'
import { GameKey, Selection, GameMode, GameEvent, RoundResult } from '../assets/js/enums.js'
import { getRequiredVariableMessage } from './utils.spec.js';
import { Player } from '../assets/js/player.js';

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
     * @param {Game} game - game
     * @param {function} picker - function taking index argument and returning a Selection, 
     *                            key associated with a Selection or Selection.None if no valid
     *                            selection
     * @returns {object} object of the form: {
     *                       plays: <player selection counts map with selection keys and count values>
     *                       selected: <set of selected selections>
     *                   }
     */
    function makePlays(game, picker) {
        const variant = game.variant;
        let plays = variant.getCountsTemplate();
        let selected = new Set();       // selections made in play
        for (let index = 0; index < game.playerCount; index++) {
            let selection = picker(index);
            if (typeof selection === 'string' || selection instanceof GameKey) {
                selection = variant.getSelection(selection);
            }
            if (selection instanceof Selection && selection !== Selection.None) {
                plays[selection]++;
                selected.add(selection);
            }
        }
        debugLog(plays, 'plays', false);
        return {
            plays: plays,
            selected: selected
        }
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

    const NUM_OF_ROUNDS = 4;    // number of game rounds in test

    /**
     * Callback function for game play
     * @param {Game} game - game object
     * @param {number} playerIndex - index of current player
     * @param {number} roundNumber - current round number
     * @returns {Selection|string} Selection or key associated with selection
     */
    function gamePlayCallback(game, playerIndex, roundNumber) {
        let selection = Selection.None;  // selection to return
        const player = game.getPlayer(playerIndex);     // current player
        const params = getRoundParams(game, roundNumber); // round params
        let winningSelection = params.rule.selection;   // winning selection
        let losingSelection = params.losingContest(playerIndex);     // losing selection
        const contests = params.rule.contests;
        const activePlayers = game.activePlayerCount;

        if (player.inGame){
            switch (roundNumber) {
                case 1:
                    // Check different selection each player, using keys
                    selection = game.variant.possibleSelections[playerIndex % activePlayers].key;
                    break;
                case 2:
                    // Check same selection each player
                    selection = game.variant.possibleSelections[0];
                    break;
                case 3:
                    // Check first player makes losing selection, and other players make same winning selection
                    selection = (playerIndex === params.selectedPlayer ? contests[losingSelection].loser : winningSelection);
                    break;
                case 4:
                    // Check one player makes winning selection
                    if (player.inGame) {
                        selection = (playerIndex === params.selectedPlayer ? 
                            winningSelection : contests[losingSelection].loser);
                    }
                    break;
                default:
                    throw new Error(`Unexpected round number: ${roundNumber}`);
            }
        }
        return selection;
    }

    /**
     * Get the round parameters to use for the specified round
     * @param {Game} game - game
     * @param {number} roundNumber - current round number
     * @returns {object} object of the form: {
     *                       rule: rule to use,
     *                       losingContest: function to get index of losing contest,
     *                       selectedPlayer: index of selected player for round
     *                   }
     */
     function getRoundParams(game, roundNumber) {
        let useRule;        // index of rule to use
        let playerIndex;    // index of player to use
        let losingContest;  // function to get index of losing contest

        switch (roundNumber) {
            case 1: // no params required
            case 2: // no params required
            case 3:
                useRule = 0;
                playerIndex = 0;
                losingContest = playerIdx => 0;
                break;
            case 4:
                useRule = game.variant.rules.length - 1;
                playerIndex = game.players.length - 1;
                losingContest = playerIdx => playerIdx % game.variant.rules[useRule].contests.length;
                break;
            default:
                throw new Error(`Unexpected round number: ${roundNumber}`);
        }
        return {
            rule: game.variant.rules[useRule],
            // winning selection is Rule.selection
            losingContest: losingContest,
            selectedPlayer: playerIndex
        }
    }

    /**
     * Game play function to perform basics checks on a game
     * @param {GameVariant} variant - variant to use for game
     * @param {number} numPayers - number of players
     * @param {number} numRobots - number of robots
     * @param {boolean} useKeys - use keys flag: if true use keys, otherwise Selections; default false
     * @returns {Game} game object
     */
     function checkGamePlay(variant, numPayers, numRobots, useKeys = false) {
        const ALL_PLAYERS = numPayers + numRobots;
        let expectedActive = ALL_PLAYERS;
        let expectedRound = 0;

        if (useKeys && numRobots > 0) {
            throw new Error("Unsupported configuration: robots currently cannot be used in 'keys' mode tests");
        }

        const game = new Game(variant, numPayers, numRobots, Game.OPT_CONSOLE);

        checkGame(game, numPayers, numRobots, 0, true, false, false);

        // function to get all selections for a round
        const selectionPicker = roundNumber => makePlays(game, playerIndex => {
            return gamePlayCallback(game, playerIndex, roundNumber);
        });

        /**
         * Callback function for testing
         * @param {GameEvent} stage - one of GameEvent.xxx
         * @param {Game} game - game object
         * @param {number} roundNumber - current round number
         * @param {object} payload - stage data
         */
        function testCallback(stage, game, roundNumber, payload) {
            let roundSelections;
            let context = null;
            let explanations = new Set();   // individual win explanations
            let params;                     // round params

            if (stage !== GameEvent.GameStart) {
                params = getRoundParams(game, roundNumber);
            }

            switch (stage) {
                case GameEvent.GameStart:
                    checkGame(game, numPayers, numRobots, expectedActive, false, true, false);
                    break;

                case GameEvent.RoundStart:
                    expect(roundNumber).toBe(++expectedRound);
                    break;

                case GameEvent.RoundSelections:
                    // confirm game counts match played selections
                    roundSelections = selectionPicker(roundNumber);
                    confirmCounts(payload, roundSelections.plays, context);
                    break;

                case GameEvent.RoundEvaluation:
                    switch (roundNumber) {
                        case 1:
                        case 2:
                            // confirm play again result for round
                            expect(payload.result).toBe(RoundResult.PlayAgain);
                            checkGame(game, numPayers, numRobots, expectedActive, false, true, false);
                            break;
                        case 3:
                            // confirm eliminate 1 player result for round
                            expect(payload.result).toBe(RoundResult.Eliminate);
                            expect(payload.data).toEqual(params.rule.contests);
                            expect(payload.explanation.length).toBe(1);
                            expect(payload.explanation[0])
                                .toEqual(
                                    jasmine.stringMatching(
                                        explanationRegex(params.rule.selection,     // winner
                                            params.rule.contests[
                                                params.losingContest(params.selectedPlayer)].loser)
                                    )
                                );
                            checkGame(game, numPayers, numRobots, expectedActive, false, true, false);
                            break;
                        case 4:
                            // confirm eliminate players result for round
                            roundSelections = selectionPicker(roundNumber);

                            // find all win explanations
                            for (const selection of roundSelections.selected) {
                                const rule = game.variant.getRule(selection);
                                for (const contest of rule.contests) {
                                    if (roundSelections.selected.has(contest.loser)) {
                                        explanations.add(explanationRegex(selection, contest.loser));
                                    }
                                }
                            }

                            debugLog(explanations, 'expected explanations', false);
                            debugLog(payload, 'evaluation');

                            expect(payload.result).toBe(RoundResult.Eliminate);
                            expect(payload.data).toEqual(params.rule.contests);
                            expect(payload.explanation.length).toBe(explanations.size);
                            for (let index = 0; index < payload.explanation.length; index++) {
                                const reason = payload.explanation[index];
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
                            break;
                        default:
                            throw new Error(`Unexpected round number: ${roundNumber}`);
                    }
                    break;

                case GameEvent.RoundProcessed:
                    switch (roundNumber) {
                        case 1:
                        case 2:
                            // confirm play again result for round
                            expect(payload.result).toBe(RoundResult.PlayAgain);
                            checkGame(game, numPayers, numRobots, expectedActive, false, true, false);
                            break;
                        case 3:
                            // confirm eliminated one player
                            --expectedActive;
                            expect(payload.result).toBe(RoundResult.PlayAgain);
                            expect(payload.data).toEqual([
                                game.getPlayer(params.selectedPlayer)
                            ]);
                            checkGame(game, numPayers, numRobots, expectedActive, false, true, false);
                            break;
                        case 4:
                            // confirm eliminated all player bar winner
                            expectedActive = 1;
                            expect(payload.result).toBe(RoundResult.Winner);
                            expect(payload.data).toBe(game.getPlayer(params.selectedPlayer));
                            checkGame(game, numPayers, numRobots, expectedActive, false, true, false);
                            break;
                        default:
                            throw new Error(`Unexpected round number: ${roundNumber}`);
                    }
                    break;

                case GameEvent.GameEnd:
                    checkGame(game, numPayers, numRobots, 0, false, false, true);
                    break;
            }
        }

        game.setGameMode(GameMode.Test, testCallback);

        if (!useKeys) {
            // test game play using callback function
            game.playGame(gamePlayCallback);
        } else {
            // test game play using events
            game.playGameEvents();

            for (let roundNum = 1; roundNum <= NUM_OF_ROUNDS; roundNum++) {
                for (let index = 0; index < game.playerCount; index++) {
                    let selection = gamePlayCallback(game, index, roundNum);
                    if (typeof selection === 'string' || selection instanceof GameKey) {
                        selection = variant.getSelection(selection);
                    }
                    if (selection instanceof Selection && selection !== Selection.None) {
                        game.makePlayEvent(selection.key.key);  // use key
                    }
                }
            }
        }

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

        const game = checkGamePlay(variant, NUM_PLAYERS, NUM_ROBOTS);
    });

    it("checks Game(BigBang)", function() {
        const variant = GameVariant.BigBang;
        const NUM_PLAYERS = variant.numPossibleSelections;
        const NUM_ROBOTS = 0;
        const ALL_PLAYERS = NUM_PLAYERS + NUM_ROBOTS;

        const game = checkGamePlay(variant, NUM_PLAYERS, NUM_ROBOTS);
    });

    it("checks Game(Xtreme)", function() {
        const variant = GameVariant.Xtreme;
        const NUM_PLAYERS = variant.numPossibleSelections;
        const NUM_ROBOTS = 0;
        const ALL_PLAYERS = NUM_PLAYERS + NUM_ROBOTS;

        const game = checkGamePlay(variant, NUM_PLAYERS, NUM_ROBOTS);
    });

    it("checks Game(Basic) - keys", function() {
        const variant = GameVariant.Basic;
        const NUM_ROBOTS = 0;
        const NUM_PLAYERS = variant.numPossibleSelections - NUM_ROBOTS;
        const ALL_PLAYERS = NUM_PLAYERS + NUM_ROBOTS;

        const game = checkGamePlay(variant, NUM_PLAYERS, NUM_ROBOTS, true);
    });

    it("checks Game(BigBang) - keys", function() {
        const variant = GameVariant.BigBang;
        const NUM_PLAYERS = variant.numPossibleSelections;
        const NUM_ROBOTS = 0;
        const ALL_PLAYERS = NUM_PLAYERS + NUM_ROBOTS;

        const game = checkGamePlay(variant, NUM_PLAYERS, NUM_ROBOTS, true);
    });

    it("checks Game(Xtreme) - keys", function() {
        const variant = GameVariant.Xtreme;
        const NUM_PLAYERS = variant.numPossibleSelections;
        const NUM_ROBOTS = 0;
        const ALL_PLAYERS = NUM_PLAYERS + NUM_ROBOTS;

        const game = checkGamePlay(variant, NUM_PLAYERS, NUM_ROBOTS, true);
    });
});
  
