import React from "react";

const ExchangeDialog = React.createClass({
   getInitialState() {
        return {exchangeTileIds: []};   
   },
   propTypes: {
        isOpen: React.PropTypes.bool.isRequired, 
        parent: React.PropTypes.object.isRequired,
        tiles: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
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
   renderTileImages() {
      return this.props.tiles.map((tile) => {
         let { exchangeTileIds } = this.state;
         let isMarkedForExchange = exchangeTileIds.some((currId) => currId === tile.id);
         return <img className={isMarkedForExchange ? "exchange-candidate" : ""} 
         onClick={this.toggleSelect.bind(null, tile.id)} src={tile.src} />;        
      }); 
   },
   render() {
       return(this.props.isOpen ?
       <div className="dialog">
         <div>
           { this.renderTileImages() }
         </div>
         <div>
           <button onClick={this.exchange} className="btn btn-success">Exchange Chosen Tiles</button>
           <button onClick={this.cancelExchange} className="btn btn-danger">Cancel</button>
         </div>
       </div>
       : null);
   } 
});

export default ExchangeDialog;