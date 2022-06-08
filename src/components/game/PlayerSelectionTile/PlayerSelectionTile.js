import React from 'react';
import './PlayerSelectionTile.css';

/**
 * Class representing a player's selection tile
 * @param {string} player - player name
 * @param {string} src - image source
 * @param {string} alt - image alt text
 * @param {Selection} selection - selection
 */
export default class PlayerSelectionTile extends React.Component {

    render() {
        const selection = this.props.selection;
        return (
            <div className='div__player-selection-tile-wrapper'>
                <h4 className='h4__player-selection-tile-player-name'>{this.props.player}</h4>
                <img className='img__player-selection-tile-img' src={this.props.src} alt={this.props.alt}/>
                <h4 className='h4__player-selection-tile-name'>{selection.name}</h4>
            </div>
        );
      }    
}



