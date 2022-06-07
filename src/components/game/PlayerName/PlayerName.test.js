import { render, screen, queryByAttribute } from '@testing-library/react';
import { default as PlayerName } from './PlayerName';

test('renders player name', () => {

    const index = 4;
    const inputId = 'player-name-id';
    const defaultName = 'joe bloggs';

    const view = render(
        <PlayerName 
            index={index} id={inputId} default={defaultName} />
    );
    const labelElement = screen.getByText(new RegExp(`Player ${index}`));
    expect(labelElement).toBeInTheDocument();

    // https://stackoverflow.com/a/53003981
    const getById = queryByAttribute.bind(null, 'id');

    const inputElement = getById(view.container, inputId);
    expect(inputElement).toBeInTheDocument();

});
