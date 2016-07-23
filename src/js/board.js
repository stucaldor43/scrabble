import React from "react";
import Cell from "./cell";

export default React.createClass({
   propTypes: {
      cellClasses: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)).isRequired,
      parent: React.PropTypes.object.isRequired
   },
   render() {
      const boardCells = this.props.cellClasses.map((rowClasses, rowIndex) => {
          let cells = rowClasses.map((curr, colIndex) => {
            return <Cell root={this.props.parent} row={rowIndex} col={colIndex} classAttrName={curr}/>;    
          });
          return <div className="row"><div className="col-xs-12">{cells}</div></div>;
          
      });
      
      return(
        <div>
          {boardCells}
        </div>
      );
   } 
});