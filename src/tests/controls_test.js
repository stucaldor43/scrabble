import React from "react";
import jsdom from "jsdom";
import { assert } from "chai";
import { shallow, mount } from "enzyme";
import Controls from "../js/controls";
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

describe("<Controls />", () => {
    const GameComponent = GameTemp.DecoratedComponent;
    let shallowWrapper;
    let mountedWrapper;
    let instance;
    
    beforeEach(() => {
        shallowWrapper = shallow(<Controls parent={<GameComponent />} />);
        mountedWrapper = mount(<GameTemp />);
        instance = mountedWrapper.get(0).getDecoratedComponentInstance();
    });
    
    it("should render buttons", () => {
        const buttonWrapper = shallowWrapper.find("button");
        let buttonTexts = [];
        buttonWrapper.forEach((node) => {
            buttonTexts.push(node.text());
            assert.equal(node.type(), "button");
        });
        const correctText = ["pass", "undo", "exchange", "end turn"];
        const allButtonsHaveExpectedText = correctText.every((expectedText) => {
            return buttonTexts.map((btnText) => {
                return btnText.toLowerCase();
            }).indexOf(expectedText) >= 0;
        });
        assert.isTrue(allButtonsHaveExpectedText);
    });
    
    it("should render a select box with 26 options", () => {
        const numberOfSelectElements = shallowWrapper.find("select").length;
        assert.equal(numberOfSelectElements, 1);
        
        const numberOfOptionElements = shallowWrapper.find("option").length;
        assert.equal(numberOfOptionElements, 26); 
    });
    
    it("should have button for passing", (done) => {
        const initialCurrentTurnPlayer = instance.currentTurnPlayer;
        mountedWrapper.find("#pass").simulate("click");
        const postPassCurrentTurnPlayer = instance.currentTurnPlayer;
        assert.notEqual(postPassCurrentTurnPlayer, initialCurrentTurnPlayer);
        done();
    });
    
    it("should have button for ending turn", (done) => {
        const initialCurrentTurnPlayer = instance.currentTurnPlayer;
        mountedWrapper.find("#end").simulate("click");
        const postEndTurnCurrentTurnPlayer = instance.currentTurnPlayer;
        assert.notEqual(postEndTurnCurrentTurnPlayer, initialCurrentTurnPlayer);
        done();
    });
    
    it("should have button for undoing last tile placement", (done) => {
        const numberOfOccupiedCells = mountedWrapper.find(".square img").length;
        assert.strictEqual(numberOfOccupiedCells, 0);
        
        const playerTileWrapper = mountedWrapper.find(".active img");
        playerTileWrapper.at(0).simulate("click");
        mountedWrapper.find(".empty").at(0).simulate("click");
        let updatedNumberOfOccupiedCells = mountedWrapper.find(".square img").length;
        assert.strictEqual(updatedNumberOfOccupiedCells, 1);
        
        mountedWrapper.find("#undo").simulate("click");
        updatedNumberOfOccupiedCells = mountedWrapper.find(".square img").length;
        assert.strictEqual(updatedNumberOfOccupiedCells, 0);
        done();
    });
    
    it("should have button that allows tiles to be exchanged", (done) => {
        const currentPlayersTiles = instance.currentTurnPlayer.getHand();
        mountedWrapper.find("#exchange").simulate("click");
        const dialogWrapper = mountedWrapper.find(".dialog");
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
});
