let tile_info_list = [{
      name: "a",
      src: "assets/a.jpg",
      value: 1,
      frequency: 9
    }, {
      name: "b",
      src: "assets/b.jpg",
      value: 3,
      frequency: 2
    }, {
      name: "c",
      src: "assets/c.jpg",
      value: 3,
      frequency: 2
    }, {
      name: "d",
      src: "assets/d.jpg",
      value: 2,
      frequency: 4
    }, {
      name: "e",
      src: "assets/e.jpg",
      value: 1,
      frequency: 12
    }, {
      name: "f",
      src: "assets/f.jpg",
      value: 4,
      frequency: 2
    }, {
      name: "g",
      src: "assets/g.jpg",
      value: 2,
      frequency: 3
    }, {
      name: "h",
      src: "assets/h.jpg",
      value: 4,
      frequency: 2
    }, {
      name: "i",
      src: "assets/i.jpg",
      value: 1,
      frequency: 9
    }, {
      name: "j",
      src: "assets/j.jpg",
      value: 8,
      frequency: 1
    }, {
      name: "k",
      src: "assets/k.jpg",
      value: 5,
      frequency: 1
    }, {
      name: "l",
      src: "assets/l.jpg",
      value: 1,
      frequency: 4
    }, {
      name: "m",
      src: "assets/m.jpg",
      value: 3,
      frequency: 2
    }, {
      name: "n",
      src: "assets/n.jpg",
      value: 1,
      frequency: 6
    }, {
      name: "o",
      src: "assets/o.jpg",
      value: 1,
      frequency: 8
    }, {
      name: "p",
      src: "assets/p.jpg",
      value: 3,
      frequency: 2
    }, {
      name: "q",
      src: "assets/q.jpg",
      value: 10,
      frequency: 1
    }, {
      name: "r",
      src: "assets/r.jpg",
      value: 1,
      frequency: 6
    }, {
      name: "s",
      src: "assets/s.jpg",
      value: 1,
      frequency: 4
    }, {
      name: "t",
      src: "assets/t.jpg",
      value: 1,
      frequency: 6
    }, {
      name: "u",
      src: "assets/u.jpg",
      value: 1,
      frequency: 4
    }, {
      name: "v",
      src: "assets/v.jpg",
      value: 4,
      frequency: 2
    }, {
      name: "w",
      src: "assets/w.jpg",
      value: 4,
      frequency: 2
    }, {
      name: "x",
      src: "assets/x.jpg",
      value: 8,
      frequency: 1
    }, {
      name: "y",
      src: "assets/y.jpg",
      value: 4,
      frequency: 2
    }, {
      name: "z",
      src: "assets/z.jpg",
      value: 10,
      frequency: 1
    }, {
      name: "blank",
      src: "assets/blank.jpg",
      value: 0,
      frequency: 2
    }, ];
    
    export default function TileBag() {
      this.tiles = [];
      let idIndex = 0;
      for (const t of tile_info_list) {
          for (let i = 0; i < t.frequency; i++) {
           let tile = Object.assign({}, t);
           tile.id = idIndex;
           this.tiles.push(tile);
           idIndex++;
          }
      }
      
    }
    
    TileBag.prototype.getTiles = function() {
      return this.tiles;
    };
    
    TileBag.prototype.draw = function() {
      return this.tiles.pop();
    };
    
    TileBag.prototype.shuffle = function() {
      for (let t of this.tiles) {
       let currItem = this.tiles[this.tiles.indexOf(t)];
       let swapCandidate = this.tiles[Math.floor(Math.random() * this.tiles.length)];
       if (currItem !== swapCandidate) {
        [currItem, swapCandidate] = [swapCandidate, currItem];
       }
       this.tiles[this.tiles.indexOf(currItem)] = swapCandidate;
       this.tiles[this.tiles.indexOf(swapCandidate)] = currItem;
      }
    };
    
    TileBag.prototype.isEmpty = function() {
      return this.tiles.length === 0;
    };