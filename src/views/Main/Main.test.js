import React from 'react';
import { screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { customAppContextRender } from  '../../App.js';
import { GameState } from '../../utils/index.js'
import { Game, GameVariant } from '../../services/game';
import Main from './Main';

test('renders main', () => {

    const providerProps = {
        value: new GameState(GameVariant.Basic)
    };

    customAppContextRender(
        <BrowserRouter>
            <Main />
        </BrowserRouter>, {providerProps});

    // TODO main test
    // const rulesElement = screen.getByText(/Rules/i);
    // expect(rulesElement).toBeInTheDocument();

    // const settingsElement = screen.getByText(/Settings/i);
    // expect(settingsElement).toBeInTheDocument();
});
