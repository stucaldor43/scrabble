import React from "react";


export default React.createClass({
   render() {
      return (
        <div className="row">
          <div className="col-xs-12">
            {this.props.board} 
          </div>
        </div>
      );
   } 
});