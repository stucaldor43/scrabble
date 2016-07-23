import React from "react"

export default React.createClass({
   propTypes: {
       scores: React.PropTypes.arrayOf(React.PropTypes.number)
   },
   render() {
       const scoreList = this.props.scores.map((score, i) => {
        return(
            <li>
                <label htmlFor={`score${i}`}>{`Player${i}`}</label>
                <input id={`score${i}`} type="text" value={score} disabled />
            </li>
        );
       });

       return (
           <div className="row">
            <div className="col-xs-12">
                { scoreList }
            </div> 
           </div>
       );
   } 
});