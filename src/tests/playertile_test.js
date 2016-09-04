import React from "react";
import jsdom from "jsdom";
import { assert } from "chai";
import { mount } from "enzyme";
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

describe("<PlayerTile />", () => {
    let wrapper;
    
    beforeEach(() => {
        wrapper = mount(<GameTemp />);
    });
    
    it("should only be highlighted when selected by player", () => {
        let selectedTileWrapper = wrapper.find(".active .current-selection");
        assert.strictEqual(selectedTileWrapper.length, 0);
        const playerTileWrapper = wrapper.find(".active img");
        playerTileWrapper.at(0).simulate("click");
        selectedTileWrapper = wrapper.find(".active .current-selection");
        assert.strictEqual(selectedTileWrapper.length, 1);
    });
    
    
});



