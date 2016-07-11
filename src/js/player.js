    export default function Player(opts={status: "active"}) {
      this.hand = []; 
      this.rackLimit = 7;
      this.status = opts.status;
    }
    
    Player.prototype.getStatus = function() {
      return this.status;  
    };
    
    Player.prototype.getHand = function() {
      return this.hand;
    };
    
    Player.prototype.setHand = function(newHand) {
      if (newHand instanceof Array) {
        this.hand = newHand;
      }
    };
    
    Player.prototype.getTile = function(id) {
      let tileIndex = this.hand.findIndex((tile) => tile.id === id);
      return (tileIndex >= 0 ? this.hand[tileIndex] : null); 
    };
    
    Player.prototype.removeTile = function(id) {
      this.hand = this.hand.filter((tile) => {
        return tile.id !== id; 
      });
    };
    
    Player.prototype.drawToLimit = function(bag) {
      while(!bag.isEmpty() && this.hand.length < this.rackLimit) {
        this.hand.push(bag.draw());
      }
    };