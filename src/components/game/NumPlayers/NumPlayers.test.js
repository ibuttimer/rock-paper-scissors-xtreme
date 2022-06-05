import { render, screen, queryByAttribute } from '@testing-library/react';
import { default as NumPlayers, generateId } from './NumPlayers';

test('renders number of players', () => {

    const titleText = 'Number of widgets';
    const minPlayers = 1;
    const maxPlayers = 20;
    const defaultPlayers = 10;

    const view = render(
        <NumPlayers title={titleText} min={minPlayers} max={maxPlayers} default={defaultPlayers}/>
    );
    const labelElement = screen.getByText(new RegExp(titleText));
    expect(labelElement).toBeInTheDocument();

    const id = generateId(titleText);

    // https://stackoverflow.com/a/53003981
    const getById = queryByAttribute.bind(null, 'id');

    const inputElement = getById(view.container, id);
    expect(inputElement).toBeInTheDocument();

});
