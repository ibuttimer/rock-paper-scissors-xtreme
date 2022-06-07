import React from 'react';
import { generateId } from '../../../utils/index.js'
import './PlayerName.css';

/**
 * Number of games component.
 * Properties:
 *  index - index of player
 *  id - id to use for input element
 *  default - default name
 */
export default class PlayerName extends React.Component {

    title = `Player ${this.props.index}`;

    id = this.props.id ? this.props.id : generateId(this.title);

    render() {
        return (
            <div className='div__player-name-wrapper'>
                <label htmlFor={this.id}>{this.title}:</label>
                <input type="text" id={this.id} key={this.id} name={this.id} defaultValue={this.props.default} />
            </div>
        );
      }    
}
