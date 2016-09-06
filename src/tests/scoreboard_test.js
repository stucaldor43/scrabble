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
  let wrapper;
  
  beforeEach(() => {
    props = {
      scores: [0, 0, 0, 0]
    };
    wrapper = shallow(<ScoreBoard scores={props.scores} />);
  });
  
  it("should render four input elements", () => {
    const inputWrapper = wrapper.find("input");
    assert.strictEqual(inputWrapper.length, 4);
    inputWrapper.forEach((node) => {
      assert.isTrue(node.hasClass("score"));
    });
  });
  
  it("should render four labels", () => {
    const numberOfLabels = wrapper.find(".score-holder label").length;
    assert.strictEqual(numberOfLabels, 4);
  });
});
