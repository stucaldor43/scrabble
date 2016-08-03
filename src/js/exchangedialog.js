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
       if (exchangeTileIds.indexOf(i) >= 0) {
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
       const styles = this.props.isOpen ? {} : {display: "none"};  
       
       return(
          <div className="dialog" style={styles}>
            <div>
              { this.renderTileImages() }
            </div>
            <div>
              <button id="dialog-submit" onClick={this.exchange} className="btn btn-success">Exchange Chosen Tiles</button>
              <button id="dialog-cancel" onClick={this.cancelExchange} className="btn btn-danger">Cancel</button>
            </div>
          </div>
       );
   } 
});

export default ExchangeDialog;