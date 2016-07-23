import React from "react";
import { Types } from "./constants";
import { DragSource } from "react-dnd";

let tileSource = {
  beginDrag(props) {
    return {src: props.src, owner: props.owner, game: props.root, tileId: props.tileId}; 
  },
  endDrag(props, monitor, component) {
    
    var { target, isTargetOccupied } = monitor.getDropResult() || {target: null, isTargetOccupied: true};
    var { tileId } = monitor.getItem();
    
    if (!monitor.didDrop() || props.owner !== props.root.currentTurnPlayer || 
    isTargetOccupied) {
      return;
    }
    
    target.setContents(props.src);
    if (props.src.indexOf("blank") >= 0) {
      const draggedTile = props.owner.getTile(tileId);
      draggedTile.name = props.root.blankTileValue;
    }
    props.root.addToTileCellList(tileId, target);
    props.root.addToRecentlyPlacedTiles(tileId);
    props.root.removeTile(tileId);
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource()
  };
}

const PlayerTile = React.createClass({
   toggleTileSelection() {
       const { owner, tileId } = this.props;
       const { highlightedTile } = this.props.root.state;

       if (this.props.root.currentTurnPlayer === owner) {
         if (!highlightedTile || highlightedTile.id !== tileId) {
          this.props.root.setState({highlightedTile: owner.getTile(tileId)});
         }
         else {
          this.props.root.setState({highlightedTile: null}); 
         }
       }
   },
   render() {
       let {connectDragSource} = this.props;
       const { isHighlighted } = this.props;

       return connectDragSource(
         <div style={{display: "inline-block"}}>
           <img src={this.props.src} onClick={this.toggleTileSelection} width="81" height="81" 
           className={isHighlighted ? "current-selection" : ""} />
         </div>
       );
   } 
});

export default DragSource(Types.TILE, tileSource, collect)(PlayerTile);

