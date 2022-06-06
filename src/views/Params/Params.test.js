import React from 'react';
import { screen } from '@testing-library/react';
import { GAME_NAME } from "../../Globals";
import { Game, GameVariant } from '../../services/game';
import { customAppContextRender } from  '../../App.js';
import Params from  './Params';
import { getVariantName, GameState } from "../../utils";

test('renders params', () => {
    [GameVariant.Basic]
    // GameVariant.AllVariants
    .forEach(variant => {
        const providerProps = {
            value: new GameState(variant)
        }
        const game = providerProps.value.game;
    
        customAppContextRender(<Params />, {providerProps});
    
        const titleElement = screen.getByText(new RegExp(`.*${getVariantName(game)}.*`));
        expect(titleElement).toBeInTheDocument();
        expect(titleElement.textContent).toBe(`${GAME_NAME} ${getVariantName(game)}`)
    });
});
