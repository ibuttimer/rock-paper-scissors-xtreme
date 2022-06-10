import React from 'react';
import './LeaderBoard.css';

/**
 * Class representing a selection tile
 * @param {GameResult} src - round result
 * @param {scores} scores - map of scores with players as key
 */
export default class LeaderBoard extends React.Component {

    /**
     * Generate the player selections
     * @param {Array} scores - array of player and score objects
     * @type {Player} player - player object
     * @type {number} score - player's score
     * @returns 
     */
    getPlayerScores(scores) {

        return scores.map((playerScore, index) => {
            let rowKey = `player-score-row-${index}`;

            return (
                <tr className='tr__player-score-row' key={rowKey}>
                    <td className='td__player-name'>{playerScore.player.name}</td>
                    <td className='td__player-score'>{playerScore.score}</td>
                </tr>
            );            
        });
    }

    render() {
        return (
            <div className='div__leader-board-wrapper'>
                <table className='table__leader-board'>
                    <thead className='thead__leader-board'>
                        <tr>
                            <th colSpan="2">Scores</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getPlayerScores(this.props.scores)}
                    </tbody>
                </table>
            </div>
        );
      }    
}
