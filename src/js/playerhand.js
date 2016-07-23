import React from "react";
import PlayerTile from "./playertile";

export default React.createClass({
    componentDidMount() {
              
    },
    propTypes: {
      parent: React.PropTypes.object.isRequired,
      id: React.PropTypes.string.isRequired,
      owner: React.PropTypes.object.isRequired,
      tiles: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },
    render() {
      let renderedTiles = this.props.tiles.map(function(curr) {
        const isHighlighted = (this.props.parent.state.highlightedTile === curr);
        return <PlayerTile isHighlighted={isHighlighted} owner={this.props.owner} root={this.props.parent} src={curr.src} tileId={curr.id} />;
      }.bind(this));
      
      return(
        <div id={this.props.id}>
          {renderedTiles}
        </div>
      );
    
    } 
});