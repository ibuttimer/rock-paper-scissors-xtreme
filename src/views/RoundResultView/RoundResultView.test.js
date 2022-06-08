import React from 'react';
import { screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { customAppContextRender } from  '../../App.js';
import { GameState } from '../../utils'
import { Game, GameVariant } from '../../services';
import RoundResultView from './RoundResultView';

test('renders round result', () => {

    const providerProps = {
        value: new GameState(GameVariant.Basic)
    };

    // customAppContextRender(
    //     <BrowserRouter>
    //         <RoundResultView />
    //     </BrowserRouter>, {providerProps});

    // TODO main play
    // const rulesElement = screen.getByText(/Rules/i);
    // expect(rulesElement).toBeInTheDocument();

    // const settingsElement = screen.getByText(/Settings/i);
    // expect(settingsElement).toBeInTheDocument();
});
