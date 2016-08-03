import React from "react";
import jsdom from "jsdom";
import { assert } from "chai";
import { shallow } from "enzyme";
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
    let wrapper;
    
    beforeEach(() => {
        wrapper = shallow(<Controls parent={<GameComponent />} />); 
    });
    
    it("renders buttons", () => {
        const buttonWrapper = wrapper.find("button");
        let buttonTextList = [];
        buttonWrapper.forEach((node) => {
            buttonTextList.push(node.text());
            assert.equal(node.type(), "button");
        });
        const correctText = ["pass", "undo", "exchange", "end turn"];
        assert.isTrue(correctText.every((expectedText) => {
            return buttonTextList.map((btnText) => {
                return btnText.toLowerCase();
            }).indexOf(expectedText) >= 0;
        }));
    });
    
    it("renders select box with 26 options", () => {
        const wrapperSelectCount = wrapper.find("select").length;
        assert.equal(wrapperSelectCount, 1);
        
        const wrapperOptionCount = wrapper.find("option").length;
        assert.equal(wrapperOptionCount, 26); 
    });
});

