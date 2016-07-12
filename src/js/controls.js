import React from "react";

export default React.createClass({
   render() {
       return(
         <div>
           <button className="btn btn-danger" onClick={this.props.parent.undo}>Undo</button>
           <button className="btn btn-warning" onClick={this.props.parent.openExchangeDialog}>Exchange</button>
         </div>
       );
   } 
});