import { assert } from "chai";
import TileBag from "../js/tilebag";

describe("TileBag", () => {
    let bag;
    
    beforeEach(() => {
        bag = new TileBag(); 
    });
    
    describe("#getTiles()", () => {
        it("returns tiles", () => {
            const tiles = bag.getTiles();
            assert.isArray(tiles);
        });
    });
    
    describe("#draw()", () => {
        it("draws tile", () => {
            const initialBagSize = bag.getTiles().length;
            const tile = bag.draw();
            assert.property(tile, "name");
            assert.property(tile, "src");
            assert.property(tile, "value");
            assert.property(tile, "frequency");
            assert.property(tile, "id");
            
            const size = bag.getTiles().length;
            assert.strictEqual(size, initialBagSize - 1);
        });  
    });
    
    describe("#shuffle()", () => {
        it("shuffles tilebag", () => {
            const unshuffledBagTiles = [];
            for (const t of bag.getTiles()) {
                unshuffledBagTiles.push(t);
            }
            bag.shuffle();
            const isInSameOrderAsOriginal = bag.getTiles().every(function(tile, i) {
                return tile === unshuffledBagTiles[i];
            });
            const bagSize = bag.getTiles().length;
            assert.strictEqual(bagSize, unshuffledBagTiles.length);
            assert.isFalse(isInSameOrderAsOriginal);
        });
      
    });
    
    describe("#insert()", () => {
       it("inserts tiles", () => {
            const tiles = [{
                name: "tile1", 
                src:"assets/tile1.jpg", 
                value: 2, 
                frequency: 1, 
                id: 180}];
            bag.insert(tiles);
            const bagContainsInsertedTiles = tiles.every((tile) => {
                return bag.getTiles().indexOf(tile) >= 0;
            });
            assert.isTrue(bagContainsInsertedTiles);
       });
    });
    
    describe("#isEmpty()", () => {
       it("indicates whether bag is empty", () => {
          assert.isFalse(bag.isEmpty());
          bag.tiles = [];
          assert.isTrue(bag.isEmpty());
       });
    });
});

