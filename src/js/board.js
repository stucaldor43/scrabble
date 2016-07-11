import React from "react";
import Cell from "./cell";

export default React.createClass({
   render() {
      const boardCells = this.props.cellClasses.map((rowClasses) => {
          let cells = rowClasses.map((curr) => {
            return <Cell classAttrName={curr}/>;    
          });
          return <div className="row"><div className="col-xs-12">{cells}</div></div>
          
      });
      
      return(
        <div>
          {boardCells}
        </div>
      );
   } 
});