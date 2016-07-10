import React from "react";
import Sortable from "sortablejs";

export default React.createClass({
    componentDidMount() {
              
    },
    render() {
      let renderedTiles = this.props.tiles.map(function(curr) {
        return <img src={curr.src} />;
      });
      return(
       <div id={this.props.id}>
         {renderedTiles}
       </div>
      );
    } 
});