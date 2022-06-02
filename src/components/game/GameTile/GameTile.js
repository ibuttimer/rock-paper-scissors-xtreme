import React from 'react';
import { Link } from "react-router-dom";
import './GameTile.css';

export default class GameTile extends React.Component {

    render() {
        return (
            <div className='div__game-tile-wrapper'>
                <img className='img__game-tile-img' src={this.props.src} alt={this.props.alt}/>
                <h3 className='h3__game-tile-name'>{this.props.name}</h3>
            </div>
        );
      }    
}



