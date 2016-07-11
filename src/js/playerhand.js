import React from "react";
import PlayerTile from "./playertile";

export default React.createClass({
    componentDidMount() {
              
    },
    render() {
      let renderedTiles = this.props.tiles.map(function(curr) {
        return <PlayerTile owner={this.props.owner} root={this.props.parent} src={curr.src} tileId={curr.id} />;
      }.bind(this));
      
      return(
        <div id={this.props.id}>
          {renderedTiles}
        </div>
      );
    
    } 
});