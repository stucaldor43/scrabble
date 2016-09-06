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

describe("<PlayerHand />", () => {
    it("should render tiles", () => {
        const wrapper = mount(<GameTemp />);
        const handWrapper = wrapper.find("PlayerHand");
        handWrapper.forEach((hand) => {
            const numberOfTilesInHand = hand.find("PlayerTile").length; 
            assert.strictEqual(numberOfTilesInHand, 7);
        });
    });
});
