import React from 'react';
import { Navbar, Footer } from './components/index.js';
import { Outlet } from "react-router-dom";
import './App.css';
import { Game, GameVariant } from './services/game.js'

/**
 * Class Component for application
 * @returns {React element} element to render
 */
export default class App extends React.Component {

    /**
     * @constructor
     * @param {object} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            game: new Game(GameVariant.Basic),
        };
    }

    render() {
        // JSX expressions must have one parent element
        // pass game object to subcomponents
        return (
        <div className="div__app-wrapper">
            <div className="div__content">
                <Navbar />
                <Outlet context={ this.state.game } />
            </div>
            <Footer />
        </div>
        );
    }
}
