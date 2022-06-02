import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GameTile from './GameTile';

test('renders navbar', () => {

    const tileName = 'Tile Name';
    const tileSrc = './somewhere/pic.png';
    const tileAlt = 'nice picture';

    render(
        <GameTile name={tileName} src={tileSrc} alt={tileAlt}/>
    );
    const nameElement = screen.getByText(new RegExp(tileName));
    expect(nameElement).toBeInTheDocument();

    const imgElement = screen.getByAltText(new RegExp(tileAlt));
    expect(imgElement).toBeInTheDocument();

});
