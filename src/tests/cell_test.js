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

describe("<Cell />", () => {
    let wrapper;
    let props;
    
    const CellComponent = Cell.DecoratedComponent;
    const GameComponent = GameTemp.DecoratedComponent;
    
    const tile = {
      name: "y",
      src: "assets/y.jpg",
      value: 4,
      frequency: 2
    };
    
    beforeEach(() => {
        props = {
            root: shallow(<GameComponent />).instance(),
            row: 0,
            col: 0,
            classAttrName: "square",
            identity: (c) => c
        };
        wrapper = shallow(<CellComponent root={props.root}
        row={props.row} col={props.col} 
        classAttrName={props.classAttrName}
        connectDropTarget={props.identity} />);    
    });
    
    it("should render Cell", () => {
        const wrapperHasClass = wrapper.hasClass(props.classAttrName); 
        assert.isTrue(wrapperHasClass);
        
        const type = wrapper.type();
        assert.strictEqual(type, "div");
    });
    
    it("should be able to have contents set or removed", () => {
        const instance = wrapper.instance();
        instance.setContents(tile);
        wrapper.update();
        const wrapperImageCount = wrapper.find("img").length;
        assert.strictEqual(wrapperImageCount, 1);
        
        instance.removeContents();
        wrapper.update();
        const newWrapperImageCount = wrapper.find("img").length;
        assert.strictEqual(newWrapperImageCount, 0);
    });
    
    it("should not render an image when unoccupied", () => {
        const wrapperImageCount = wrapper.find("img").length;
        assert.strictEqual(wrapperImageCount, 0);    
    });
    
    it("should render an image when occupied", () => {
       const initialWrapperImageCount = wrapper.find("img").length;
       assert.strictEqual(initialWrapperImageCount, 0);
       
       wrapper.instance().setContents(tile);
       wrapper.update();
       const currentWrapperImageCount = wrapper.find("img").length;
       assert.strictEqual(currentWrapperImageCount, 1);
    });
});
