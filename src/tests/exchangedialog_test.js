import React from "react";
import jsdom from "jsdom";
import { assert } from "chai";
import { shallow } from "enzyme";
import ExchangeDialog from "../js/exchangedialog";
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

const GameComponent = GameTemp.DecoratedComponent;

describe("<ExchangeDialog />", function() {
    let props;
    let wrapper;
    
    beforeEach(function() {
        props = {
            parent: <GameComponent />,
            tiles: [{
                name: "z",
                src: "assets/z.jpg",
                value: 10,
                frequency: 1,
                id: 120
            }, {
                name: "y",
                src: "assets/y.jpg",
                value: 4,
                frequency: 2,
                id: 101
                }]
        };
        wrapper = shallow(<ExchangeDialog isOpen={true}
        parent={props.parent} tiles={props.tiles} />);
    });
   
    it("should render buttons when it is open", function() {
        const buttonWrapper = wrapper.find("button");
        assert.equal(buttonWrapper.length, 2);
        
        const buttonTexts = buttonWrapper.map(function(node) {
            return node.text().toLowerCase();
        });
        const expectedButtonTexts = ["exchange chosen tiles", "cancel"];
        const allButtonsHaveExpectedText = expectedButtonTexts.every(function(word) {
            return buttonTexts.indexOf(word) >= 0;       
        });
        assert.isTrue(allButtonsHaveExpectedText);
    });
    
    it("should render images for tiles", function() {
        const imageWrapper = wrapper.find("img");
        let playerTileSrcs = imageWrapper.map(function(node) {
            return node.get(0).props.src;
        });
        
        props.tiles.forEach(function(expectedTile) {
            const index = playerTileSrcs.indexOf(expectedTile.src);
            playerTileSrcs = playerTileSrcs.filter((tileSrc, i) => i !== index);
            assert.isAtLeast(index, 0);
        });
        assert.equal(imageWrapper.length, props.tiles.length);
    });
});
