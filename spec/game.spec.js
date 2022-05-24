/*
  Test suite for game.js
 */
import { Rule, Selection, GameVariant } from '../assets/js/game.js'

/* 
  Check Rule class
 */
describe("check Rule", function() {
  it("checks Rule::addDefeat(selection)", function() {
      // basic rock-scissors rule
      let rule = new Rule(Selection.Rock);
      expect(rule.defeats.length).toBe(0);

      rule.addDefeat(Selection.Scissors);
      expect(rule.defeats.length).toBe(1);
  });

  it("checks Rule::addDefeat(selection array)", function() {
    // rock-[scissors, paper] rule
    let rule = new Rule(Selection.Rock);
    expect(rule.defeats.length).toBe(0);

    rule.addDefeat([Selection.Scissors, Selection.Paper]);
    expect(rule.defeats.length).toBe(2);
  });

  it("checks Rule set defeats", function() {
    // basic rock-scissors rule
    let rule = new Rule(Selection.Rock);
    expect(rule.defeats.length).toBe(0);

    rule.defeats = [Selection.Scissors];
    expect(rule.defeats.length).toBe(1);
  });

  it("checks Rule.of(selection)", function() {
    // basic rock-scissors rule
    let rule = Rule.of(Selection.Rock, Selection.Scissors);
    expect(rule.defeats.length).toBe(1);
  });

  it("checks Rule.of(selection array)", function() {
    // rock-[scissors, paper] rule
    let rule = Rule.of(Selection.Rock, [Selection.Scissors, Selection.Paper]);
    expect(rule.defeats.length).toBe(2);
  });

  it("checks Rule::beats()", function() {
    // basic rock-scissors rule
    let rule = new Rule(Selection.Rock);
    expect(rule.defeats.length).toBe(0);

    rule.addDefeat(Selection.Scissors);
    expect(rule.defeats.length).toBe(1);

    expect(rule.beats(Selection.Scissors)).toBe(true);
    expect(rule.beats(Selection.Paper)).toBe(false);
  });
});

/**
 * Perform rules check
 * @param {Array} rules - rules to check
 * @param {object} loserMap - map with Selection as key and list of losers as value
 */
function rulesCheck(rules, loserMap) {
  for (const rule of rules) {
    if (!loserMap.hasOwnProperty(rule.selection)) {
        throw new Error(`Unexpected selection: ${rule.selection}`);
    }
    let losers = loserMap[rule.selection];

    // check all selections
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

/* 
  Check GameVariant statics
 */
describe("check GameVariant", function() {
  it("checks GameVariant.Basic", function() {
      // see https://github.com/ibuttimer/rock-paper-scissors-xtreme/blob/main/design/design.md#basic-rules
      let rules = GameVariant.Basic.rules;
      expect(rules.length).toBe(3);

      let losers = {};
      losers[Selection.Rock] = [Selection.Scissors];
      losers[Selection.Paper] = [Selection.Rock];
      losers[Selection.Scissors] = [Selection.Paper];

      rulesCheck(rules, losers);
  });

  it("checks GameVariant.BigBang", function() {
    // see https://github.com/ibuttimer/rock-paper-scissors-xtreme/blob/main/design/design.md#big-bang-rules
    let rules = GameVariant.BigBang.rules;
    expect(rules.length).toBe(5);

    let losers = {};
    losers[Selection.Rock] = [Selection.Scissors, Selection.Lizard];
    losers[Selection.Paper] = [Selection.Rock, Selection.Spock];
    losers[Selection.Scissors] = [Selection.Paper, Selection.Lizard];
    losers[Selection.Lizard] = [Selection.Paper, Selection.Spock];
    losers[Selection.Spock] = [Selection.Rock, Selection.Scissors];

    rulesCheck(rules, losers);
  });

  it("checks GameVariant.Xtreme", function() {
    // see https://github.com/ibuttimer/rock-paper-scissors-xtreme/blob/main/design/design.md#xtreme-rules
    let rules = GameVariant.Xtreme.rules;
    expect(rules.length).toBe(9);

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

    rulesCheck(rules, losers);
  });
});
