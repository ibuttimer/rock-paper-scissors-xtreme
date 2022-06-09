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
     * @param {GameResult} roundResult - round result
     * @param {scores} scores - map of scores with players as key
     * @returns 
     */
    getPlayerScores(roundResult, scores) {

        return roundResult.players.map((player, index) => {
            let rowKey = `player-score-row-${index}`;

            return (
                <tr className='tr__player-score-row' key={rowKey}>
                    <td className='td__player-name'>{player.name}</td>
                    <td className='td__player-score'>{scores.get(player)}</td>
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
                        {this.getPlayerScores(this.props.roundResult, this.props.scores)}
                    </tbody>
                </table>
            </div>
        );
      }    
}
