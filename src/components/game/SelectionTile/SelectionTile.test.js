import { render, screen } from '@testing-library/react';
import SelectionTile from './SelectionTile';

test('renders game tile', () => {

    const tileName = 'Selection Name';
    const tileSrc = './somewhere/pic.png';
    const tileAlt = 'nice picture';

    render(
        <SelectionTile name={tileName} src={tileSrc} alt={tileAlt}/>
    );
    const nameElement = screen.getByText(new RegExp(tileName));
    expect(nameElement).toBeInTheDocument();

    const imgElement = screen.getByAltText(new RegExp(tileAlt));
    expect(imgElement).toBeInTheDocument();

});
