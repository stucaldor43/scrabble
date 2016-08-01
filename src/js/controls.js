import React from "react";

const Controls = React.createClass({
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
           <button id="pass" className="btn btn-success" onClick={this.props.parent.pass}>Pass</button>
           <button id="undo" className="btn btn-danger" onClick={this.props.parent.undo}>Undo</button>
           <button id="exchange" className="btn btn-warning" onClick={this.props.parent.openExchangeDialog}>Exchange</button>
           <button id="end" className="btn btn-primary" onClick={this.props.parent.endTurn}>End Turn</button>
           <select id="tile-value-picker" className="picker" ref={this.setDefaultValue} onChange={this.setBlankTileValue} name="blank-tile-value">
            {options}
           </select>
         </div>
       );
   } 
});

export default Controls;