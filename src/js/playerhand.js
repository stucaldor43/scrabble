import React from "react";
import Sortable from "sortablejs";

export default React.createClass({
    componentDidMount() {
      this.configSortable();        
    },
    configSortable() {
      let sortable = new Sortable(document.getElementById(this.props.id), {
         group: this.props.id,
         sort: false,
         draggable: "img",
         chosenClass: "sortable-chosen"
      });
      
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