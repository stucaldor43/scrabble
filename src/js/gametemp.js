import React from "react";
import TileBag from "./tilebag";
import Player from "./player";
import PlayerHand from "./playerhand";
import ScoreBoard from "./scoreboard";
import Controls from "./controls";
import Board from "./board";
import HTML5Backend from "react-dnd-html5-backend"
import { DragDropContext } from "react-dnd"

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

const Root = React.createClass({
    getDefaultProps() {
      return {numberOfPlayers: 2};
    },
    componentWillMount() {
      this.bag = new TileBag();
      this.bag.shuffle();
      this.players = [];
      this.playerIds = ["player1", "player2", "player3", "player4"]
      this.recentlyPlacedTiles = [];
      this.start();
      this.setState({players: this.players});
    },
    addToRecentlyPlacedTiles(tile) {
      this.recentlyPlacedTiles.push(tile);
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
      
    },
    createBoard() {
      return boardLayout.map((currentRow, i) => {
        let boardTiles = currentRow.map((sym) => {
          return this.getCorrespondingJSXElement(sym);
        });
        return boardTiles;
      });
    },
    getCorrespondingJSXElement(symbols) {
      let element;
      switch(symbols) {
        case "WWW":
              element = "triple-word square";
              break;
        case "WW":
              element = "double-word square";
              break;
        case "LL":
              element = "double-letter square";
              break;
        case "LLL":
              element = "triple-letter square";
              break;
        case "F":
              element = "free square";
              break;
        case "*":
              element = "empty square";
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
          <PlayerHand owner={this.players[1]} parent={this} id={this.playerIds[1]} tiles={this.players[1].getHand()}/>
          <PlayerHand owner={this.players[2]} parent={this} id={this.playerIds[2]} tiles={this.players[2].getHand()}/>
          <Board cellClasses={this.createBoard()} />
          <PlayerHand owner={this.players[3]} parent={this} id={this.playerIds[3]} tiles={this.players[3].getHand()}/>
          <PlayerHand owner={this.players[0]} parent={this} id={this.playerIds[0]} tiles={this.players[0].getHand()}/>
        </div>
      );
    } 
});

export default DragDropContext(HTML5Backend)(Root)