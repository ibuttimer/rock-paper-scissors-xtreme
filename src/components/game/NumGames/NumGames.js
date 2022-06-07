import React from 'react';
import { generateId, optionsList } from '../../../utils/index.js'
import './NumGames.css';


/**
 * Generate a number of games option argument
 * @param {string} title - label to display
 * @param {Array} selections - array of selections
 * @param {number} optionDefault - default selection
 */
export function numGamesOption(title, selections, optionDefault, id = null, selectId = null) {
    return {
        title: title, 
        selections: selections, 
        optionDefault: optionDefault,
        id: id,
        selectId: selectId
    }
}

/**
 * Number of games component.
 * Properties:
 *  options - array of options
 *      : title - label to display
 *      : selections - array of selections
 *      : optionDefault - default number from selections
 *  group - group name
 *  default - default number
 *  onchange - onchange function for options
 */
export default class NumGames extends React.Component {

    componentDidMount() {
        // set checked state for default option
        for (let option of this.props.options) {
            if (this.props.default === option.optionDefault) {
                document.getElementById(
                    this.generateRadioId(option)
                ).checked = true;    
                break;
            }
        }
    }
    
    generateRadioId = (option) => option.id ? option.id : generateId(option.title);

    generateSelectId = (option, id, index) => option.selectId ? option.selectId : `${id}-select-${index}`;

    /**
     * Generate selections list
     * @param {object} props - properties
     * @returns {JSXElement}
     */
    selectionsList(props) {
        return props.options.map((x, index) => {
                let id = this.generateRadioId(x);
                let optionKey = `num-games-option-${index}`;

                if (x.selections) {
                    // a radio option with a select
                    let selectId = this.generateSelectId(x, id, index);

                    return (
                        <div className='div__num-games-option-wrapper' key={optionKey}>
                            <input type="radio" id={id} key={id} name={props.group} value={x.optionDefault} 
                                onChange={props.onchange} />
                            <label htmlFor={id}>{x.title}</label>
                            <select id={selectId} name={selectId} key={selectId} defaultValue={x.default}
                                onChange={props.onchange}>
                                {optionsList(selectId, x.selections)}
                            </select>
                        </div>
                    );
                } else {
                    // no select, just a radio option
                    return (
                        <div className='div__num-games-option-wrapper' key={optionKey}>
                            <input type="radio" id={id} key={id} name={props.group} value={x.optionDefault} 
                                onChange={props.onchange} />
                            <label htmlFor={id}>{x.title}</label>
                        </div>
                    );
                }
            });
    }

    render() {
        return (
            <div className='div__num-games-wrapper'>
                {this.selectionsList(this.props)}
            </div>
        );
      }    
}
