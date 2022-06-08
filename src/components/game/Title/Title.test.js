import React from 'react';
import { screen } from '@testing-library/react';
import { GAME_NAME } from "../../Globals";
import { customAppContextRender } from  '../../App.js';
import { getVariantName, GameState, Subscription } from "../../utils";
import { GameVariant } from '../../services';
import { Title, RoundNumber, CurrentPlayerName } from './Title';

function testTitle(variant) {
    const providerProps = {
        value: new GameState(variant)
    }
    const game = providerProps.value.game;

    customAppContextRender(
        <Title />
        , {providerProps});

    const titleElement = screen.getByText(new RegExp(`.*${GAME_NAME}.*`));
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.textContent).toBe(`${GAME_NAME} ${getVariantName(game)}`)
}

test(`renders title ${GameVariant.Basic}`, () => {
    testTitle(GameVariant.Basic);
});

test(`renders title ${GameVariant.BigBang}`, () => {
    testTitle(GameVariant.BigBang);
});

test(`renders title ${GameVariant.Xtreme}`, () => {
    testTitle(GameVariant.Xtreme);
});

test(`renders round number`, () => {

    const subscription = new Subscription();
    const providerProps = {
        value: new GameState(GameVariant.Basic)
    }
    const roundText = 'Round';
    let round = 1;

    customAppContextRender(
        <RoundNumber round={round} subscription={subscription} />
    , {providerProps});

    const roundElement = screen.getByText(new RegExp(`.*${roundText}.*`));
    expect(roundElement).toBeInTheDocument();
    expect(roundElement.textContent).toBe(`${roundText} ${round}`)
});

test(`renders player name`, () => {

    const subscription = new Subscription();
    const providerProps = {
        value: new GameState(GameVariant.Basic)
    }
    let playerName = 'Joe Bloggs';

    customAppContextRender(
        <CurrentPlayerName playerName={playerName} subscription={subscription} />
    , {providerProps});

    const playerElement = screen.getByText(new RegExp(`.*${playerName}.*`));
    expect(playerElement).toBeInTheDocument();
    expect(playerElement.textContent).toBe(`${playerName}`)
});
