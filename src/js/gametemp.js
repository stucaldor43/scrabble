import React from "react";
import TileBag from "./tilebag";
import Player from "./player";
import PlayerHand from "./playerhand";
import ScoreBoard from "./scoreboard";
import Controls from "./controls";
import Board from "./board";
import Sortable from "sortablejs";

const boardLayout = [["WWW", "*", "*", "LL", "*", "*", "*",
"WWW", "*", "*", "*", "LL", "*", "*", "WWW"], ["*", "WW", 
"*", "*", "*", "LLL", "*", "*", "*", "LLL", "*", "*", "*",
"WW", "*"], ["*", "*", "WW", "*", "*", "*", "LL", "*", "LL",
"*", "*", "*", "WW", "*", "*"], ["LL", "*", "*", "WW", "*",
"*", "*", "LL", "*", "*", "*", "WW", "*", "*", "LL"], ["*", 
"*", "*", "*", "WW", "*", "*", "*", "*", "*", "WW", "*", 
"*", "*", "*"], ["*", "LLL", "*", "*", "*", "LLL", "*", "*", 
"*", "LLL", "*", "*", "*", "LLL", "*"], ["*", "*", "LL", 
"*", "*", "*", "LL", "*", "LL", "*", "*", "*", "LL", "*", 
"*"], ["WWW", "*", "*", "LL", "*", "*", "*", "F", "*", "*", 
"*", "LL", "*", "*", "WWW"], ["*", "*", "LL", "*", "*", "*", 
"LL", "*", "LL", "*", "*", "*", "LL", "*", "*"], ["*", "LLL", 
"*", "*", "*", "LLL", "*", "*", "*", "LLL", "*", "*", "*", 
"LLL", "*"], ["*", "*", "*", "*", "WW", "*", "*", "*", "*", 
"*", "WW", "*", "*", "*", "*"], ["LL", "*", "*", "WW", "*", 
"*" , "*", "LL", "*", "*", "*", "WW", "*", "*", "LL"], ["*", 
"*", "WW", "*", "*", "*", "LL", "*", "LL", "*", "*", "*", 
"WW", "*", "*"], ["*", "WW", "*", "*", "*", "LLL", "*", "*", 
"*", "LLL", "*", "*", "*", "WW", "*"], ["WWW", "*", "*", "LL", 
"*", "*", "*", "WWW", "*", "*", "*", "LL", "*", "*", "WWW"]];

export default React.createClass({
    getDefaultProps() {
      return {numberOfPlayers: 2};
    },
    componentWillMount() {
      this.bag = new TileBag();
      this.bag.shuffle();
      this.players = [];
      this.playerIds = ["player1", "player2", "player3", "player4"];
      this.start();
      this.setState({players: this.players});
    },
    addPlayers() {
      for (var i = 0; i < 4; i++) {
        if (i < this.props.numberOfPlayers) {
          this.players.push(new Player());
        }
        else {
          this.players.push(new Player({status: "inactive"}));
        }
      }
    },
    setPlayerToGoFirst() {
      this.currentTurnPlayer = this.players[Math.floor(Math.random() * this.props.numberOfPlayers)]; 
    },
    shiftCurrentTurnPlayer() {
      let currentPlayerIndex = this.state.players.findIndex((x) => x === this.currentTurnPlayer);
      this.currentTurnPlayer = this.state.players[(currentPlayerIndex + 1) % this.props.numberOfPlayers];
    },
    dealInitialHands() {
      for (let p of this.players) {
        p.drawToLimit(this.bag);
      }
    },
    componentDidMount() {
      console.log(document.getElementById("game-container"));
    },
    createBoard() {
      return boardLayout.map((currentRow, i) => {
        let boardTiles = currentRow.map((sym) => {
          return this.getCorrespondingJSXElement(sym);
        });
        return <div className="row" ><div id={i} className="col-xs-12" 
        ref={(c) => this.configSortable(c)}>{boardTiles}</div></div>;
      });
    },
    getCorrespondingJSXElement(symbols) {
      let element;
      switch(symbols) {
        case "WWW":
              element = <div className="triple-word square">3W</div>;
              break;
        case "WW":
              element = <div className="double-word square">2W</div>;
              break;
        case "LL":
              element = <div className="double-letter square">2L</div>;
              break;
        case "LLL":
              element = <div className="triple-letter square">3L</div>;
              break;
        case "F":
              element = <div className="free square">Free</div>;
              break;
        case "*":
              element = <div className="empty square"></div>;
              break;
        default: throw new Error("Unrecognizable symbol detected");
      }
      return element;
    },
    start() {
      this.addPlayers();
      this.dealInitialHands();
      this.setPlayerToGoFirst(); 
    },
    render() {
      return (
        <div class="container-fluid">
          <ScoreBoard />
          <Controls />
          <PlayerHand id={this.playerIds[1]} tiles={this.players[1].getHand()}/>
          <PlayerHand id={this.playerIds[2]} tiles={this.players[2].getHand()}/>
          <Board board={this.createBoard()} />
          <PlayerHand id={this.playerIds[3]} tiles={this.players[3].getHand()}/>
          <PlayerHand id={this.playerIds[0]} tiles={this.players[0].getHand()}/>
        </div>
      );
    } 
});