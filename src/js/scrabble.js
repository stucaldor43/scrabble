window.addEventListener("load", function() {
    
    
    const GameView = React.createClass({
        getInitialState() {
          return null;  
        },
        render() {
          return null;    
        }
    });
    
    const BoardView = React.createClass({
        render() {
          return null;
        }
    });
    
    const TileBagView = React.createClass({
        render() {
          return null;
        }
    });
    
    const PlayerTilesView = React.createClass({
        render() {
          return null;
        }
    });
    
    let tile_info_list = [{
      name: "a",
      src: "images/a.jpg",
      value: 1,
      frequency: 9
    }, {
      name: "b",
      src: "images/b.jpg",
      value: 3,
      frequency: 2
    }, {
      name: "c",
      src: "images/c.jpg",
      value: 3,
      frequency: 2
    }, {
      name: "d",
      src: "images/d.jpg",
      value: 2,
      frequency: 4
    }, {
      name: "e",
      src: "images/e.jpg",
      value: 1,
      frequency: 12
    }, {
      name: "f",
      src: "images/f.jpg",
      value: 4,
      frequency: 2
    }, {
      name: "g",
      src: "images/g.jpg",
      value: 2,
      frequency: 3
    }, {
      name: "h",
      src: "images/h.jpg",
      value: 4,
      frequency: 2
    }, {
      name: "i",
      src: "images/i.jpg",
      value: 1,
      frequency: 9
    }, {
      name: "j",
      src: "images/j.jpg",
      value: 8,
      frequency: 1
    }, {
      name: "k",
      src: "images/k.jpg",
      value: 5,
      frequency: 1
    }, {
      name: "l",
      src: "images/l.jpg",
      value: 1,
      frequency: 4
    }, {
      name: "m",
      src: "images/m.jpg",
      value: 3,
      frequency: 2
    }, {
      name: "n",
      src: "images/n.jpg",
      value: 1,
      frequency: 6
    }, {
      name: "o",
      src: "images/o.jpg",
      value: 1,
      frequency: 8
    }, {
      name: "p",
      src: "images/p.jpg",
      value: 3,
      frequency: 2
    }, {
      name: "q",
      src: "images/q.jpg",
      value: 10,
      frequency: 1
    }, {
      name: "r",
      src: "images/r.jpg",
      value: 1,
      frequency: 6
    }, {
      name: "s",
      src: "images/s.jpg",
      value: 1,
      frequency: 4
    }, {
      name: "t",
      src: "images/t.jpg",
      value: 1,
      frequency: 6
    }, {
      name: "u",
      src: "images/u.jpg",
      value: 1,
      frequency: 4
    }, {
      name: "v",
      src: "images/v.jpg",
      value: 4,
      frequency: 2
    }, {
      name: "w",
      src: "images/w.jpg",
      value: 4,
      frequency: 2
    }, {
      name: "x",
      src: "images/x.jpg",
      value: 8,
      frequency: 1
    }, {
      name: "y",
      src: "images/y.jpg",
      value: 4,
      frequency: 2
    }, {
      name: "z",
      src: "images/z.jpg",
      value: 10,
      frequency: 1
    }, {
      name: "blank",
      src: "images/blank.jpg",
      value: 0,
      frequency: 2
    }, ];
    
    function TileBag() {
      this.tiles = [];
      for (const t of tile_info_list) {
          for (let i = 0; i < t.frequency; i++) {
           this.tiles.push(Object.assign({}, t));
          }
      }
      
    }
    
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
    
    function Player(game) {
      this.hand = []; 
      this.game = game;
      this.rackLimit = 7;
    }
    
    Player.prototype.hand = function() {
      return this.hand;
    };
    
    Player.prototype.drawToLimit = function() {
      while(!this.game.getBag().isEmpty() && this.hand.length < this.rackLimit) {
        this.hand.push(this.game.getBag().draw());
      }
    };
    
    function Game(opts={players: 2}) {
      this.bag = new TileBag();
      this.bag.shuffle();
      this.playerCount = opts.players;
      this.players = [];
      this.currentTurnPlayer = null;
    }
    
    Game.prototype.getBag = function() {
      return this.bag;  
    };
    
    Game.prototype.start = function() {
      this.addPlayers();
      this.dealInitialHands();
      this.randomlySetCurrentTurnPlayer();
    };
    
    Game.prototype.addPlayers = function() {
      for (var i = 0; i < this.playerCount; i++) {
        this.players.push(new Player(this));
      }
    };
    
    Game.prototype.dealInitialHands = function() {
      for (const player of this.players) {
        player.drawToLimit();
      }
    };
    
    Game.prototype.randomlySetCurrentTurnPlayer = function() {
      this.currentTurnPlayer = this.players[Math.floor(Math.random() * this.players.length)];
    };
    
    Game.prototype.cleanUp = function() {
      
    };
    
    
    
    
    
});