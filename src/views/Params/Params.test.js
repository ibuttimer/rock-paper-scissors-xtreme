import React from 'react';
import { screen } from '@testing-library/react';
import { GAME_NAME } from "../../Globals";
import { Game, GameVariant } from '../../services/game';
import { customAppContextRender } from  '../../App.js';
import Params from  './Params';
import { getVariantName } from "../../utils";

test('renders params', () => {

    GameVariant.AllVariants.forEach(variant => {
        const providerProps = {
            value: new Game(variant)
        };
    
        customAppContextRender(<Params />, {providerProps});
    
        const titleElement = screen.getByText(new RegExp(`.*${getVariantName(providerProps.value)}.*`));
        expect(titleElement).toBeInTheDocument();
        expect(titleElement.textContent).toBe(`${GAME_NAME} ${getVariantName(providerProps.value)}`)
    });
});
