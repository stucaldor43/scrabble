import React from "react";
import jsdom from "jsdom";
import { assert } from "chai";
import { shallow } from "enzyme";
import Cell from "../js/cell";
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

const CellComponent = Cell.DecoratedComponent;
const GameComponent = GameTemp.DecoratedComponent;

describe("<Cell />", () => {
    let wrapper;
    
    const tile = {
      name: "y",
      src: "assets/y.jpg",
      value: 4,
      frequency: 2
    };
    
    const props = {
        root: <GameComponent />,
        row: 0,
        col: 0,
        classAttrName: "square",
        identity: (c) => c
    };
    
    beforeEach(() => {
        wrapper = shallow(<CellComponent root={props.root}
        row={props.row} col={props.col} 
        classAttrName={props.classAttrName}
        connectDropTarget={props.identity} />);    
    });
    
    it("renders Cell", () => {
        const wrapperHasClass = wrapper.hasClass(props.classAttrName); 
        assert.isTrue(wrapperHasClass);
        
        const type = wrapper.type();
        assert.strictEqual(type, "div");
    });
    
    it("can have contents removed", () => {
        const instance = wrapper.instance();
        
        instance.setContents(tile.src);
        wrapper.update();
        const wrapperImageCount = wrapper.find("img").length;
        assert.strictEqual(wrapperImageCount, 1);
        
        instance.removeContents();
        wrapper.update();
        const newWrapperImageCount = wrapper.find("img").length;
        assert.strictEqual(newWrapperImageCount, 0);
    });
    
    it("does not show an image when unoccupied", () => {
        const wrapperImageCount = wrapper.find("img").length;
        assert.strictEqual(wrapperImageCount, 0);    
    });
    
    it("shows an image when occupied", () => {
       const initialWrapperImageCount = wrapper.find("img").length;
       assert.strictEqual(initialWrapperImageCount, 0);
       
       wrapper.instance().setContents(tile.src);
       wrapper.update();
       const currentWrapperImageCount = wrapper.find("img").length;
       assert.strictEqual(currentWrapperImageCount, 1);
    });
});

