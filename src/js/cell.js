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
   setContents(src) {
     this.setState({occupant: <img src={src} />});   
   },
   removeContents() {
     this.setState({occupant: null});  
   },
   render() {
       let { connectDropTarget } = this.props;
       
       return connectDropTarget(
         <div className={this.props.classAttrName}>
           {this.state.occupant || ""}
         </div>
       );
   } 
});

export default DropTarget(Types.TILE, targetSpec, collect)(Cell);

