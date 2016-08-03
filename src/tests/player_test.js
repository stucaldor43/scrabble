import { assert } from "chai";
import TileBag from "../js/tilebag";
import Player from "../js/player";

describe("Player", () => {
    let player;
    let bag;
    const tile = {
        name: "a",
        src: "assets/a.jpg",
        value: 1,
        frequency: 9,
        id: 2
    };
    
    beforeEach(() => {
      player = new Player();
      bag = new TileBag();
    });
    
    describe("#drawToLimit()", () => {
      it("draws cards until limit is reached", () => {
        player.drawToLimit(bag);
        let handContents = player.getHand();
      
        assert.strictEqual(handContents.length, 7);
      });  
    });
    
    describe("#getStatus()", () => {
      it("returns status", () => {
        const status = player.getStatus();
        assert.strictEqual(status, "active");
      });
    });
    
    describe("#getScore()", () => {
      it("returns score", () => {
        const score = player.getScore();
        assert.isNumber(score);
      });  
    });
    
    describe("#setScore()", () => {
      it("sets score", () => {
        const newScore = 4;
        player.setScore(newScore);
        const score = player.getScore();
        assert.strictEqual(score, newScore);
      });
    });
    
    describe("#getHand()", () => {
      it("returns hand", () => {
        const hand = player.getHand();
        assert.isArray(hand);
      });  
    });
    
    describe("#setHand()", () => {
      it("sets hand", () => {
        const newHand = [tile];
        player.setHand(newHand);
        const hand = player.getHand();
        assert.strictEqual(hand, newHand);
      });
    });
    
    describe("#getTile()", () => {
      it("returns tile", () => {
        const newHand = [tile];
        player.setHand(newHand);
        const result = player.getTile(tile.id);
        assert.isObject(result);
        assert.isNotNull(result);
      });  
    });
    
    describe("#removeTile()", () => {
      it("removes tile from hand", () => {
        const newHand = [tile];
        player.setHand(newHand);
        const initialTileCount = player.getHand().length; 
        assert.strictEqual(initialTileCount, 1);
        
        player.removeTile(tile.id);
        const postRemovalTileCount = player.getHand().length;
        assert.strictEqual(postRemovalTileCount, 0);
      });  
    });
    
    describe("#addTile()", () => {
      it("adds tile to hand", () => {
        const initialHandSize = player.getHand().length;
        player.addTile(tile);
        const updatedHandSize = player.getHand().length; 
        assert.strictEqual(updatedHandSize, initialHandSize + 1);
      });  
    });
    
});

