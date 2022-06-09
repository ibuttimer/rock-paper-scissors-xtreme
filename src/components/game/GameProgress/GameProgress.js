import React from 'react';
import './GameProgress.css';

/**
 * Class representing a selection tile
 * @param {Map} progress - match progress
 * @type {string} key - name
 * @type {number} value - value
 */
export default class GameProgress extends React.Component {

    /**
     * Generate the progress rows
     * @param {Map} progress - round result
     * @param {scores} scores - map of scores with players as key
     * @returns 
     */
    getGameProgress(progress) {

        return Array.from(progress).map((entry, index) => {
            let rowKey = `game-progress-row-${index}`;

            return (
                <tr className='tr__game-progress-row' key={rowKey}>
                    <td className='td__game-progress-info'>{entry[0]}</td>
                    <td className='td__game-progress-data'>{entry[1]}</td>
                </tr>
            );            
        });
    }

    render() {
        return (
            <div className='div__game-progress-wrapper'>
                <table className='table__game-progress'>
                    <tbody>
                        {this.getGameProgress(this.props.progress)}
                    </tbody>
                </table>
            </div>
        );
      }    
}
