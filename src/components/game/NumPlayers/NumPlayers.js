import React from 'react';
import { generateId, optionsList } from '../../../utils/index.js'
import './NumPlayers.css';

/**
 * Number of players component.
 * Properties:
 *  title - label to display
 *  min - min number of players
 *  max - max number of players
 *  default - default number of players
 *  onchange - onchange function
 */
export default class NumPlayers extends React.Component {

    id = generateId(this.props.title);

    render() {
        return (
            <div className='div__num-players-wrapper'>
                <label htmlFor={this.id}>{this.props.title}:</label>
                <select id={this.id} name={this.id} defaultValue={this.props.default}
                    onChange={this.props.onchange}>
                    {optionsList(
                            this.id,
                            [...Array(this.props.max - this.props.min + 1).keys()],
                            x => x + this.props.min
                        )
                    }
                </select>
            </div>
        );
      }    
}
