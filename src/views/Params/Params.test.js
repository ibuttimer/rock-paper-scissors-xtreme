import React from 'react';
import { screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GAME_NAME } from "../../Globals";
import { GameVariant } from '../../services';
import { customAppContextRender } from  '../../App.js';
import Params from  './Params';
import { getVariantName, GameState } from "../../utils";

function testParams(variant) {
    const providerProps = {
        value: new GameState(variant)
    }
    const game = providerProps.value.game;

    customAppContextRender(
        <BrowserRouter>
            <Params />
        </BrowserRouter>, {providerProps});

    const titleElement = screen.getByText(new RegExp(`.*${getVariantName(game)}.*`));
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.textContent).toBe(`${GAME_NAME} ${getVariantName(game)}`)
}

test(`renders params ${GameVariant.Basic}`, () => {
    testParams(GameVariant.Basic);
});

test(`renders params ${GameVariant.BigBang}`, () => {
    testParams(GameVariant.BigBang);
});

test(`renders params ${GameVariant.Xtreme}`, () => {
    testParams(GameVariant.Xtreme);
});
