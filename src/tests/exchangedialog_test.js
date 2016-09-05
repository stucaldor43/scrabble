import React from "react";
import jsdom from "jsdom";
import { assert } from "chai";
import { shallow } from "enzyme";
import ExchangeDialog from "../js/exchangedialog";
import GameTemp from "../js/gametemp";

// setup the simplest document possible
var doc = jsdom.jsdom('<!doctype html><html><body></body></html>')

// get the window object out of the document
var win = doc.defaultView

// set globals for mocha that make access to document and window feel 
// natural in the test environment
global.document = doc
global.window = win

// take all properties of the window object and also attach it to the 
// mocha global object
propagateToGlobal(win)

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
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
    });
   
    it("renders buttons when it is open", function() {
        const wrapper = shallow(<ExchangeDialog isOpen={true}
        parent={props.parent} tiles={props.tiles} />);
        const buttonWrapper = wrapper.find("button");
        const buttonTexts = buttonWrapper.map(function(node) {
            return node.text().toLowerCase();
        });
        const expectedWords = ["exchange chosen tiles", "cancel"];
        
        assert.equal(buttonWrapper.length, 2);
        
        const areExpectedWordsPresent = expectedWords.every(function(word) {
            return buttonTexts.indexOf(word) >= 0;       
        });
        assert.isTrue(areExpectedWordsPresent);
    });
    
    it("renders images for tiles", function() {
        const wrapper = shallow(<ExchangeDialog isOpen={true}
        parent={props.parent} tiles={props.tiles} />);
        const imageWrapper = wrapper.find("img");
        const exchangeCandidateTileSrcs = imageWrapper.map(function(node) {
            return node.get(0).props.src;
        });
        
        props.tiles.forEach(function(expectedTile) {
            const index = exchangeCandidateTileSrcs.indexOf(expectedTile.src);
            assert.isAtLeast(index, 0);
        });
        assert.equal(imageWrapper.length, props.tiles.length);
    });
});
