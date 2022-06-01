/*
  Test suite for game.js
 */
import { Selection } from '../public/assets/js/enums.js'
import { Player, Robot } from '../public/assets/js/player.js';

/**
 * Check player attributes
 * @param {Player|Robot} player - player to check
 * @param {string} name - name of player
 * @param {boolean} isRobot - robot flag
 * @param {boolean} inGame - playing flag
 * @param {Selection} selection - current selection
 * @param {boolean} nToBe - name matches flag 
 * @param {boolean} rToBe - robot matches flag 
 * @param {boolean} gToBe - playing matches flag 
 * @param {boolean} sToBe - selection matches flag 
 */
function checkPlayer(player, name, isRobot, inGame, selection, 
                      nToBe = true, rToBe = true, gToBe = true, sToBe = true) {
    if (nToBe) {
        expect(player.name).toBe(name);
    } else  {
        expect(player.name).not.toBe(name);
    }
    if (rToBe) {
        expect(player.isRobot).toBe(isRobot);
    } else {
        expect(player.isRobot).not.toBe(isRobot);
    }
    if (gToBe) {
        expect(player.inGame).toBe(inGame);
    } else {
        expect(player.inGame).not.toBe(inGame);
    }
    if (sToBe) {
        expect(player.selection).toBe(selection);
    } else {
        expect(player.selection).not.toBe(selection);
    }
}

/* 
  Check Player class
 */
describe("check Player", function() {
    it("checks Player()", function() {
        let player = new Player();
        checkPlayer(player, null, false, false, Selection.None, false);
        checkPlayer(player, undefined, false, false, Selection.None, false);
    });

    it("checks Player(name)", function() {
        const name = 'RockMonster';
        let player = new Player(name);
        checkPlayer(player, name, false, false, Selection.None);
    });
});

/* 
  Check Robot class
 */
describe("check Robot", function() {
    it("checks Robot()", function() {
        let player = new Robot();
        checkPlayer(player, null, true, false, Selection.None, false);
        checkPlayer(player, undefined, true, false, Selection.None, false);
    });
  
    it("checks Robot(id)", function() {
      const id = 12345;
      let player = new Robot(id);
      checkPlayer(player, null, true, false, Selection.None, false);
      expect(player.name).toContain(id.toString());
    });
});
