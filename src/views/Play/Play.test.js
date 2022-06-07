import React from 'react';
import { screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { customAppContextRender } from  '../../App.js';
import { GameState } from '../../utils'
import { Game, GameVariant } from '../../services';
import Play from './Play';

test('renders play', () => {

    const providerProps = {
        value: new GameState(GameVariant.Basic)
    };

    customAppContextRender(
        <BrowserRouter>
            <Play />
        </BrowserRouter>, {providerProps});

    // TODO main play
    // const rulesElement = screen.getByText(/Rules/i);
    // expect(rulesElement).toBeInTheDocument();

    // const settingsElement = screen.getByText(/Settings/i);
    // expect(settingsElement).toBeInTheDocument();
});
