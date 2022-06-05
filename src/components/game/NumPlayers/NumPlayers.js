import React from 'react';
import './NumPlayers.css';

/**
 * Generate id for NumPlayers input element
 * @param {string} title
 * @returns {string} id
 */
export function generateId(title) {
    return `${title.replaceAll(/\W+/g, '-')}-num-players`;
}

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

    /**
     * Generate the number of player options
     * @param {object} props - component properties
     * @returns 
     */
    optionsList(props) {
        return [...Array(props.max - props.min + 1).keys()]
            .map(x => {
                let num = x + props.min;
                let key = `${this.id}-${num}`;
                return <option value={num} key={key}>{num}</option>;
            });
    }

    render() {
        return (
            <div className='div__num-players-wrapper'>
                <label htmlFor={this.id}>{this.props.title}:</label>
                <select id={this.id} name={this.id} defaultValue={this.props.default}
                    onChange={this.props.onchange}>
                    {this.optionsList(this.props)}
                </select>
            </div>
        );
      }    
}
