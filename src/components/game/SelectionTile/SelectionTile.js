import React from 'react';
import './SelectionTile.css';

/**
 * Class representing a selection tile
 * @param {string} src - image source
 * @param {string} alt - image alt text
 * @param {Selection} selection - selection
 * @param {Function} onclick - function to handle click
 */
export default class SelectionTile extends React.Component {

    render() {
        const selection = this.props.selection;
        return (
            <div className='div__selection-tile-wrapper' onClick={() => this.props.onclick(selection)}>
                <img className='img__selection-tile-img' src={this.props.src} alt={this.props.alt}/>
                <h4 className='h4__selection-tile-name'>{selection.name}</h4>
            </div>
        );
      }    
}



