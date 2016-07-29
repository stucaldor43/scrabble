import React from "react";

export default React.createClass({
   propTypes: {
       scores: React.PropTypes.arrayOf(React.PropTypes.number)
   },
   renderScores() {
        return this.props.scores.map((score, i) => {
            return(
                <li className="score-holder">
                    <label htmlFor={`score${i}`}>{`Player${i}`}</label>
                    <input className="score" id={`score${i}`} type="text" value={score} disabled />
                </li>
            );
        });       
   },
   render() {
       return (
           <div className="row">
            <div className="col-xs-12">
             <ul className="score-list">
                { this.renderScores() }
             </ul>
            </div> 
           </div>
       );
   } 
});