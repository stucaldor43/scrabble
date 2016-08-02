import React from "react";
import PlayerTile from "./playertile";

const PlayerHand = React.createClass({
    propTypes: {
      parent: React.PropTypes.object.isRequired,
      id: React.PropTypes.string.isRequired,
      owner: React.PropTypes.object.isRequired,
      tiles: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
      isActive: React.PropTypes.bool.isRequired
    },
    renderTiles() {
      return this.props.tiles.map((curr) => {
        const isHighlighted = (this.props.parent.state.highlightedTile === curr);
        return <PlayerTile isHighlighted={isHighlighted} owner={this.props.owner} root={this.props.parent} src={curr.src} tileId={curr.id} />;
      });
    },
    render() {
      return(
        <div id={this.props.id} className={this.props.isActive ? "active" : ""}>
          { this.renderTiles() }
        </div>
      );
    
    } 
});

export default PlayerHand;