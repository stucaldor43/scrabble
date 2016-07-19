import React from "react";
import TileBag from "./tilebag";
import Player from "./player";
import PlayerHand from "./playerhand";
import ScoreBoard from "./scoreboard";
import Controls from "./controls";
import Board from "./board";
import ExchangeDialog from "./exchangedialog"
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import words from "an-array-of-english-words";

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
const ROWLIMIT = 15;
const COLUMNLIMIT = 15;
const CellState = {
  EMPTY: "",
  NONEXISTENT: null
};
const Direction = {
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
  DOWN: "down"
};
const DOUBLEWORDCLASS = "double-word";
const TRIPLEWORDCLASS = "triple-word";
const DOUBLELETTERCLASS = "double-letter";
const TRIPLELETTERCLASS = "triple-letter";
const FREECLASS = "free";

const Root = React.createClass({
    getDefaultProps() {
      return {numberOfPlayers: 2};
    },
    getInitialState() {
      return {isExchangeDialogOpen: false};
    },
    componentWillMount() {
      this.bag = new TileBag();
      this.bag.shuffle();
      this.players = [];
      this.playerIds = ["player1", "player2", "player3", "player4"];
      this.recentlyPlacedTiles = [];
      this.tileCellList = [];
      this.cellRefs = new Array(ROWLIMIT);
      for (let i = 0; i < 15; i++) {
        this.cellRefs[i] = new Array(COLUMNLIMIT);
      }
      this.legalWordList = words;
      this.start();
      this.setState({players: this.players});
    },
    addToTileCellList(tileId, cell) {
      const tile = this.currentTurnPlayer.getTile(tileId);
      this.tileCellList.push({tile: tile, cell: cell});
    },
    deleteFromTileCellList(tileId) {
      this.tileCellList = this.tileCellList.filter((tileCell) => tileCell.tile.id !== tileId);
    },
    getCellFromTileCellList(tileId) {
      const index = this.tileCellList.findIndex((tileCell) => tileCell.tile.id === tileId);
      return (index >= 0 ? this.tileCellList[index].cell : null);
    },
    getTileFromTileCellList(cell) {
      const index = this.tileCellList.findIndex((tileCell) => tileCell.cell === cell );
      return (index >= 0 ? this.tileCellList[index].tile : null);
    },
    pass() {
      if (this.recentlyPlacedTiles.length === 0) {
        this.shiftCurrentTurnPlayer();
      }
      
    },
    undo() {
      if (this.recentlyPlacedTiles.length >= 1) {
        const tile = this.recentlyPlacedTiles.pop();
        this.currentTurnPlayer.addTile(tile);
        this.setState({players: this.players});
        const cell = this.getCellFromTileCellList(tile.id);
        cell.removeContents();
        this.deleteFromTileCellList(tile.id);
      }
    },
    endTurn() {
      if (this.recentlyPlacedTiles.length >= 1) {
        const info = this.getTurnInformation();
        const { allTilesArePartOfTheSameWord, isRecentlyPlacedCellAFreeSpace } = info;
        const { tilePlacedThisTurnIsAdjacentToPreviouslyPlacedTile, allWordsAreLegal} = info;
        const { score } = info;
        const tilesInSameRowOrColumn = this.recentlyPlacedTilesAreInSameRowOrColumn();
        
        if (tilesInSameRowOrColumn && allWordsAreLegal && allTilesArePartOfTheSameWord && 
        (tilePlacedThisTurnIsAdjacentToPreviouslyPlacedTile || isRecentlyPlacedCellAFreeSpace)) {
          this.currentTurnPlayer.setScore(this.currentTurnPlayer.getScore() + score);
        }
        else {
          while(this.recentlyPlacedTiles.length > 0) {
            this.undo();
          }  
        }
        this.resetRecentlyPlacedTiles();
        this.setState({players: this.players});
      }
      this.replenishCurrentTurnPlayerHand();
      this.shiftCurrentTurnPlayer();
    },
    getTurnInformation() {
      let newestCells = [];
      for (let tile of this.recentlyPlacedTiles) {
        newestCells.push(this.getCellFromTileCellList(tile.id));
      }
      const isRecentlyPlacedCellAFreeSpace = newestCells.some((cell) => {
        return cell.props.row === Math.floor(ROWLIMIT / 2) && 
        cell.props.col === Math.floor(COLUMNLIMIT / 2);
      });
      const tilePlacedThisTurnIsAdjacentToPreviouslyPlacedTile = newestCells.some((cell, i, arr) => {
        const adjacentCells = this.getAdjacentCellContents(cell.props.row, cell.props.col);
        let allAdjacentCells = [adjacentCells.left, adjacentCells.right, adjacentCells.above, adjacentCells.below];
        allAdjacentCells = allAdjacentCells.filter((cell) => cell !== null && typeof cell === "object");
        for (const nearbyCell of allAdjacentCells) {
          if (arr.indexOf(nearbyCell) === -1) {
            return true;
          }
        }
        return false;
      }); 
      const cellsWithBonus = newestCells.filter((cell) => {
        const classes = cell.props.classAttrName.split(" ");
        return (classes.includes(TRIPLEWORDCLASS) || classes.includes(DOUBLELETTERCLASS) ||
        classes.includes(DOUBLEWORDCLASS) || classes.includes(TRIPLELETTERCLASS) ||
        classes.includes(FREECLASS));
      });
      for (var cell of cellsWithBonus) {
        let tileOnCell = this.getTileFromTileCellList(cell);
        tileOnCell.cellClass = cell.props.classAttrName;
      }
      let listOfListsContainingWordFormingTiles = [];
      for (const cell of newestCells) {
         let leftmostWordsTiles = [];
         let furthestConnectedLeftCell = this.getFurthestConnectedCellInGivenDirection(cell.props.row, cell.props.col, Direction.LEFT);
         
         while(true) {
           if (furthestConnectedLeftCell) {
            leftmostWordsTiles.push(this.getTileFromTileCellList(furthestConnectedLeftCell));
            furthestConnectedLeftCell = this.getAdjacentCellContents(furthestConnectedLeftCell.props.row, furthestConnectedLeftCell.props.col).right;
           }
           else {
             break;
           }
         }
         let northmostWordsTiles = [];
         let furthestConnectedAboveCell = this.getFurthestConnectedCellInGivenDirection(cell.props.row, cell.props.col, Direction.UP);
         while(true) {
           if (furthestConnectedAboveCell) {
            northmostWordsTiles.push(this.getTileFromTileCellList(furthestConnectedAboveCell));
            furthestConnectedAboveCell = this.getAdjacentCellContents(furthestConnectedAboveCell.props.row, furthestConnectedAboveCell.props.col).below;
           }
           else {
             break;
           }
         }
         listOfListsContainingWordFormingTiles.push(leftmostWordsTiles, northmostWordsTiles);
      }
      var bothArraysHaveSameContents = function(a, b) {
        if (a.length !== b.length) {
          return false;
        }
        for (var i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) {
            return false;
          }
        }
        return true;
      };
      listOfListsContainingWordFormingTiles =  listOfListsContainingWordFormingTiles.reduce((prev, curr, i, arr) => {
        let isAlreadyInResult = prev.some((tilesComposingWord) => {
          return bothArraysHaveSameContents(tilesComposingWord, curr);
        });
        if (!isAlreadyInResult && curr.length >= 2) {
          prev.push(curr);
        }
        return prev;
      }, []);
      const score = listOfListsContainingWordFormingTiles.reduce((prev, wordTilesList) => {
        let bonusMultiplier = 1;
        let score = 0;
        for (let tile of wordTilesList) {
          if (tile.cellClass && (tile.cellClass.includes(DOUBLEWORDCLASS) ||
          tile.cellClass.includes(FREECLASS))) {
            bonusMultiplier *= 2;
            score += tile.value;
          }
          else if (tile.cellClass && tile.cellClass.includes(TRIPLEWORDCLASS)) {
            bonusMultiplier *= 3;
            score += tile.value;
          }
          else if (tile.cellClass && tile.cellClass.includes(DOUBLELETTERCLASS)) {
            score += (tile.value * 2);
          }
          else if (tile.cellClass && tile.cellClass.includes(TRIPLELETTERCLASS)) {
            score += (tile.value * 3);
          }
          else {
            score += tile.value;
          }
        }
        prev += (score * bonusMultiplier);
        return prev;
      }, 0);
      for (var cell of cellsWithBonus) {
        let tileOnCell = this.getTileFromTileCellList(cell);
        delete tileOnCell.cellClass;
      }
      const formedWords = listOfListsContainingWordFormingTiles.map((wordTilesList) => {
        return wordTilesList.map((tile) => tile.name).join("");
      });
      const allWordsAreLegal = formedWords.every((word) => this.legalWordList.indexOf(word) >= 0 );
      const allTilesArePartOfTheSameWord = listOfListsContainingWordFormingTiles.some((wordTilesList) => {
        return this.recentlyPlacedTiles.every((tile) => wordTilesList.indexOf(tile) >= 0 );
      });
      const allTilesUsedBonus = (this.recentlyPlacedTiles.length === 7 ? 50 : 0);
      return {
        score: score + allTilesUsedBonus,
        allTilesArePartOfTheSameWord: allTilesArePartOfTheSameWord,
        isRecentlyPlacedCellAFreeSpace: isRecentlyPlacedCellAFreeSpace,
        tilePlacedThisTurnIsAdjacentToPreviouslyPlacedTile: tilePlacedThisTurnIsAdjacentToPreviouslyPlacedTile,
        allWordsAreLegal: allWordsAreLegal
      };
    },
    recentlyPlacedTilesAreInSameRowOrColumn() {
      const cellsOfRecentlyPlacedTiles = this.recentlyPlacedTiles.map((tile) => this.getCellFromTileCellList(tile.id));
      return cellsOfRecentlyPlacedTiles.every((cell, i, arr) => arr.every((arrCell) => {
        return arrCell.props.row === cell.props.row || arrCell.props.col === cell.props.col;
      }));
    },
    areFormedWordsLegal(wordList) {
      return wordList.every((word) => this.legalWordList.indexOf(word) >= 0 );
    },
    getFurthestConnectedCellInGivenDirection(row, col, direction) {
        if (direction === Direction.UP || direction === Direction.DOWN) {
            direction = (direction === Direction.UP ? "above" : "below");
        }
        let furthestCellInDirection = this.cellRefs[row][col];
        while(true) {
          let adjacentCells = this.getAdjacentCellContents(furthestCellInDirection.props.row, furthestCellInDirection.props.col);
          let cellContents = adjacentCells[direction];
          if (cellContents) {
            furthestCellInDirection = cellContents;
          }
          else {
            break;
          }
        }
        return furthestCellInDirection;
        
        
    },
    resetRecentlyPlacedTiles() {
      this.recentlyPlacedTiles = [];
    },
    openExchangeDialog() {
      if (this.bag.getTiles().length >= 7 && this.recentlyPlacedTiles.length === 0) {
        this.setState({isExchangeDialogOpen: true});
      }
    },
    exchangeTiles(tileIds) {
      let tiles = tileIds.map((id) => this.currentTurnPlayer.getTile(id));
      this.bag.insert(tiles);
      for (const id of tileIds) {
        this.currentTurnPlayer.removeTile(id);
      }
      this.currentTurnPlayer.drawToLimit(this.bag);
      this.setState({players: this.players});
      this.shiftCurrentTurnPlayer();
    },
    addToRecentlyPlacedTiles(id) {
      let tile = this.currentTurnPlayer.getTile(id);
      if (tile) {
        this.recentlyPlacedTiles.push(tile);
      }
    },
    removeTile(id) {
      this.currentTurnPlayer.removeTile(id);
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
    replenishCurrentTurnPlayerHand() {
      this.currentTurnPlayer.drawToLimit(this.bag);
      this.setState({players: this.players});
    },
    getAdjacentCellContents(row, col) {
      let adjacentCellCoordinates = {
        left: {row: row, col: col - 1},
        right: {row: row, col: col + 1},
        above: {row: row - 1, col: col},
        below: {row: row + 1, col: col}
      };
      let adjacentCells = {};
      for (var prop in adjacentCellCoordinates) {
        let coordsObject = adjacentCellCoordinates[prop];
        let isCell = coordsObject.row >= 0 && coordsObject.row <= Math.floor(ROWLIMIT - 1) &&
        coordsObject.col >= 0 && coordsObject.col <= Math.floor(COLUMNLIMIT - 1);
        if (isCell) {
          adjacentCells[prop] = (this.cellRefs[coordsObject.row][coordsObject.col].state.occupant ?
          this.cellRefs[coordsObject.row][coordsObject.col] : CellState.EMPTY);
        }
        else {
          adjacentCells[prop] = CellState.NONEXISTENT;
        }
      }
      return adjacentCells;
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
      const playerScores = this.state.players.map((player) => player.score);
      
      return (
        <div class="container-fluid">
          <ScoreBoard scores={playerScores}/>
          <Controls parent={this}/>
          <PlayerHand owner={this.players[1]} parent={this} id={this.playerIds[1]} tiles={this.players[1].getHand()}/>
          <PlayerHand owner={this.players[2]} parent={this} id={this.playerIds[2]} tiles={this.players[2].getHand()}/>
          <Board cellClasses={this.createBoard()} parent={this} />
          <ExchangeDialog isOpen={this.state.isExchangeDialogOpen} parent={this} tiles={this.currentTurnPlayer.getHand()}/>
          <PlayerHand owner={this.players[3]} parent={this} id={this.playerIds[3]} tiles={this.players[3].getHand()}/>
          <PlayerHand owner={this.players[0]} parent={this} id={this.playerIds[0]} tiles={this.players[0].getHand()}/>
        </div>
      );
    } 
});

export default DragDropContext(HTML5Backend)(Root);