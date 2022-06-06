import { render, screen, queryByAttribute } from '@testing-library/react';
import { default as NumGames, numGamesOption } from './NumGames';

test('renders number of games', () => {

    const title1Text = 'title num 1';
    const title2Text = 'second title';
    const radio1Id = 'radio-1-id';
    const radio2Id = 'radio-2-id';
    const min = 5;
    const max = 15;
    const defaultWidgets = 10;
    const options = [
        numGamesOption(title1Text, null, 1, radio1Id),
        numGamesOption(
            title2Text, 
            // odd numbers greater than 1 up to max inclusive
            [...Array(max - min + 1).keys()], 
            defaultWidgets !== 1 ? defaultWidgets : min,
            radio2Id
        )
    ];

    const view = render(
        <NumGames 
            options={options} group={'num-of-widgets'} default={defaultWidgets} />
    );
    const labelElement = screen.getByText(new RegExp(title1Text));
    expect(labelElement).toBeInTheDocument();

    // https://stackoverflow.com/a/53003981
    const getById = queryByAttribute.bind(null, 'id');

    const radio1Element = getById(view.container, radio1Id);
    expect(radio1Element).toBeInTheDocument();
    const radio2Element = getById(view.container, radio2Id);
    expect(radio2Element).toBeInTheDocument();

});
