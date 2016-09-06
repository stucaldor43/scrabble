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
    
    it("should have button for passing", (done) => {
      const initialCurrentTurnPlayer = instance.currentTurnPlayer;
      wrapper.find("#pass").simulate("click");
      const postPassCurrentTurnPlayer = instance.currentTurnPlayer;
      assert.notEqual(postPassCurrentTurnPlayer, initialCurrentTurnPlayer);
      done();
    });
    
    it("should have button for ending turn", (done) => {
      const initialCurrentTurnPlayer = instance.currentTurnPlayer;
      wrapper.find("#end").simulate("click");
      const postEndTurnCurrentTurnPlayer = instance.currentTurnPlayer;
      assert.notEqual(postEndTurnCurrentTurnPlayer, initialCurrentTurnPlayer);
      done();
    });
    
    it("should allow tiles to be exchanged", (done) => {
      const currentPlayersTiles = instance.currentTurnPlayer.getHand();
      wrapper.find("#exchange").simulate("click");
      const dialogWrapper = wrapper.find(".dialog");
      dialogWrapper.find("img").forEach((node) => {
        node.simulate("click");
      });
      dialogWrapper.find("#dialog-submit").simulate("click");
      const newTiles = instance.currentTurnPlayer.getHand();
      const tilesAreInSameOrder = newTiles.every((tile, i) => {
        return tile === currentPlayersTiles[i];   
      });
      assert.isFalse(tilesAreInSameOrder);
      done();
    });
    
    it("should allow user to click to move tiles", (done) => {
      const numberOfTilesOnBoard = wrapper.find(".square img").length;
      assert.equal(numberOfTilesOnBoard, 0);
      
      const activePlayersHandWrapper = wrapper.find(".active");
      const playerTilesWrapper = activePlayersHandWrapper.find("img");
      playerTilesWrapper.at(0).simulate("click");
      const emptyCellsWrapper = wrapper.find(".empty");
      emptyCellsWrapper.at(0).simulate("click");
      const updatedNumberOfTilesOnBoard = wrapper.find(".square img").length;
      assert.equal(updatedNumberOfTilesOnBoard, 1);
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
