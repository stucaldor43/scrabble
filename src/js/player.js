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
    
    Player.prototype.drawToLimit = function(bag) {
      while(!bag.isEmpty() && this.hand.length < this.rackLimit) {
        this.hand.push(bag.draw());
      }
    };