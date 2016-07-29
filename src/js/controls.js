import React from "react";

export default React.createClass({
   propTypes: {
       parent: React.PropTypes.object.isRequired
   },
   setBlankTileValue() {
       this.props.parent.blankTileValue = this.tileValueSelectBox.value;
   },
   setDefaultValue(c) {
       this.tileValueSelectBox = c;
       this.props.parent.blankTileValue = this.tileValueSelectBox.value;
   },
   render() {
       const options = [];
       for (let i = 65; i < 91; i++) {
         const letter = String.fromCharCode(i);
         if (i === 65) {
          options.push(<option selected value={letter.toLowerCase()}>{letter}</option>);
         }
         else {
          options.push(<option value={letter.toLowerCase()}>{letter}</option>);
         }
       }

       return(
         <div className="controls">
           <button className="btn btn-success" onClick={this.props.parent.pass}>Pass</button>
           <button className="btn btn-danger" onClick={this.props.parent.undo}>Undo</button>
           <button className="btn btn-warning" onClick={this.props.parent.openExchangeDialog}>Exchange</button>
           <button className="btn btn-primary" onClick={this.props.parent.endTurn}>End Turn</button>
           <select className="picker" ref={this.setDefaultValue} onChange={this.setBlankTileValue} name="blank-tile-value">
            {options}
           </select>
         </div>
       );
   } 
});