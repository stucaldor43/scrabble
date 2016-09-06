import React from "react";
import jsdom from "jsdom";
import { assert } from "chai";
import { mount } from "enzyme";
import sinon from "sinon";
import GameTemp from "../js/gametemp";

var doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
var win = doc.defaultView;

global.document = doc;
global.window = win;

propagateToGlobal(win);

function propagateToGlobal (window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (key in global) continue

    global[key] = window[key]
  }
}

describe("<GameTemp />", () => {
    let spy;
    let wrapper;
    let instance;
    const numberOfConsecutiveUnscoredTurnsUntilGameEnds = 6;
    
    beforeEach(() => {
      wrapper = mount(<GameTemp />);
      instance = wrapper.get(0).getDecoratedComponentInstance();  
    });
    
    afterEach(() => {
      spy.restore();
    });
    
    it("should call componentWillMount", (done) => {
      spy = sinon.spy(GameTemp.DecoratedComponent.prototype, "componentWillMount");
      mount(<GameTemp />);
      assert.isTrue(spy.calledOnce);
      done();
    });
    
    it("should return true for #isGameOver when the game has ended", (done) => {
      assert.isFalse(instance.isGameOver());
      const endTurnButton = wrapper.find("#end");
      
      for (let i = 0; i < numberOfConsecutiveUnscoredTurnsUntilGameEnds; i++) {
        endTurnButton.simulate("click");
        if (i < (numberOfConsecutiveUnscoredTurnsUntilGameEnds - 1)) {
          assert.isFalse(instance.isGameOver());
        }
      }
      
      assert.isTrue(instance.isGameOver());
      done();
    });
    
    it("should calculate correct score when the game has ended", (done) => {
      const expectedScores = [];
      
      for (const p of instance.players) {
        const playerTileSum = p.getHand().reduce((prev, tile) => {
          prev += tile.value;
          return prev;
        }, 0);
        const expectedScore = 0 - playerTileSum;
        expectedScores.push(expectedScore);
      }
      
      for (let i = 0; i < numberOfConsecutiveUnscoredTurnsUntilGameEnds; i++) {
        wrapper.find("#end").simulate("click");
      }
      
      const allPlayersHaveExpectedScores = instance.players.every((player, i) => {
        return player.score === expectedScores[i];
      });
      assert.isTrue(allPlayersHaveExpectedScores);
      done();
    });
});
