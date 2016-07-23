import React from "react";
import { Types } from "./constants";
import { DropTarget } from "react-dnd";

let targetSpec = {
    drop(props, monitor, component) {
        console.log("compatible object dropped");
        return {target: component, isTargetOccupied: (component.state.occupant ? true : false)};
    },
    canDrop(props, monitor) {
        const item = monitor.getItem();
        return item.owner === item.game.currentTurnPlayer;
    }
};

function collect(connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget()    
    };
}

const Cell = React.createClass({
   getInitialState() {
     return {occupant: null};
   },
   componentDidMount() {
     const { row, col } = this.props;
     this.props.root.cellRefs[row][col] = this;  
   },
   handleClick() {
    const { highlightedTile } = this.props.root.state;
    const { root } = this.props;

    if (highlightedTile) {
     this.setState({occupant: <img src={highlightedTile.src} />});
     root.addToTileCellList(highlightedTile.id, this);
     root.addToRecentlyPlacedTiles(highlightedTile.id);
     root.removeTile(highlightedTile.id);
     root.setState({players: root.players, highlightedTile: null});  
    }
   },
   setContents(src) {
     this.setState({occupant: <img src={src} />});   
   },
   removeContents() {
     this.setState({occupant: null});  
   },
   render() {
       let { connectDropTarget } = this.props;
       
       return connectDropTarget(
         <div onClick={this.handleClick} className={this.props.classAttrName}>
           {this.state.occupant || ""}
         </div>
       );
   } 
});

export default DropTarget(Types.TILE, targetSpec, collect)(Cell);

