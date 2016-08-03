import React from "react";
import jsdom from "jsdom";
import { assert } from "chai";
import { shallow } from "enzyme";
import ScoreBoard from "../js/scoreboard";

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

describe("<ScoreBoard />", () => {
  let props;
  
  beforeEach(() => {
    props = {
      scores: [0, 0, 0, 0]
    };
  });
  
  it("renders four input elements", () => {
    const wrapper = shallow(<ScoreBoard scores={props.scores} />);
    const inputWrapper = wrapper.find("input");
    assert.strictEqual(inputWrapper.length, 4);
    inputWrapper.forEach((node) => {
      assert.isTrue(node.hasClass("score"));
    });
  });
  
  it("renders four labels", () => {
    const wrapper = shallow(<ScoreBoard scores={props.scores} />);
    const labelWrapper = wrapper.find(".score-holder label");
    assert.strictEqual(labelWrapper.length, 4);
  });
});

