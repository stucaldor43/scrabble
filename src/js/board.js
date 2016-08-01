import React from "react";
import Cell from "./cell";

const Board = React.createClass({
   propTypes: {
      cellClasses: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)).isRequired,
      parent: React.PropTypes.object.isRequired
   },
   renderCells() {
      return this.props.cellClasses.map((rowClasses, rowIndex) => {
          let cells = rowClasses.map((curr, colIndex) => {
            return <Cell root={this.props.parent} row={rowIndex} col={colIndex} classAttrName={curr}/>;    
          });
          return <div className="row"><div className="col-xs-12">{cells}</div></div>;
      }); 
   },
   render() {
      return(
        <div>
          { this.renderCells() }
        </div>
      );
   } 
});

export default Board;