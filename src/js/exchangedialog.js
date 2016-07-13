import React from "react";

export default React.createClass({
   getInitialState() {
        return {exchangeTileIds: []};   
   },
   componentWillMount() {
         
   },
   closeExchangeDialog() {
        this.props.parent.setState({isExchangeDialogOpen: false});
   },
   exchange() {
        let { exchangeTileIds } = this.state;
        this.props.parent.exchangeTiles(exchangeTileIds);
        this.setState({ exchangeTileIds: [] });
        this.closeExchangeDialog();
   },
   cancelExchange() {
        this.setState({exchangeTileIds: []});
        this.closeExchangeDialog();
   },
   toggleSelect(i) {
       let { exchangeTileIds } = this.state;
       if (exchangeTileIds.includes(i)) {
         exchangeTileIds = exchangeTileIds.filter((id) => id !== i);
       }
       else {
         exchangeTileIds.push(i);
       }
       this.setState({exchangeTileIds: exchangeTileIds});
   },
   render() {
       let tileImages = this.props.tiles.map((tile) => {
         let { exchangeTileIds } = this.state;
         let isMarkedForExchange = exchangeTileIds.includes(tile.id);
         return <img className={isMarkedForExchange ? "exchange-candidate" : ""} 
         onClick={this.toggleSelect.bind(null, tile.id)} src={tile.src} />;        
       });
       
       return(this.props.isOpen ?
       <div className="dialog">
         <div>
           {tileImages}
         </div>
         <div>
           <button onClick={this.exchange} className="btn btn-success">Exchange Chosen Tiles</button>
           <button onClick={this.cancelExchange} className="btn btn-danger">Cancel</button>
         </div>
       </div>
       : null);
   } 
});