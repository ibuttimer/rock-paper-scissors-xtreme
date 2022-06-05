import React from 'react';
import { render } from '@testing-library/react';
import { Navbar, Footer } from './components/index.js';
import { Outlet } from "react-router-dom";
import { DEFAULT_PLAYERS, DEFAULT_ROBOTS } from './Globals.js'
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
            game: new Game(GameVariant.Basic, DEFAULT_PLAYERS, DEFAULT_ROBOTS),
        };
    }

    render() {
        // JSX expressions must have one parent element
        // pass game object to subcomponents
        return (
            <AppContext.Provider value={this.state.game}>
                <div className="div__app-wrapper">
                    <div className="div__content">
                        <Navbar />
                        <Outlet />
                    </div>
                    <Footer />
                </div>
            </AppContext.Provider>
        );
    }
}

export const AppContext = React.createContext();


/**
 * A custom render to setup providers. Extends regular
 * render options with `providerProps` to allow injecting
 * different scenarios to test with.
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 * @see https://testing-library.com/docs/example-react-context/
 * @see https://codesandbox.io/s/github/kentcdodds/react-testing-library-examples/tree/main/
 * @see https://codesandbox.io/s/github/kentcdodds/react-testing-library-examples/tree/main/?file=/src/react-context.js:327-337
 */
 export const customAppContextRender = (ui, {providerProps, ...renderOptions}) => {
    return render(
      <AppContext.Provider {...providerProps}>{ui}</AppContext.Provider>,
      renderOptions,
    )
  }