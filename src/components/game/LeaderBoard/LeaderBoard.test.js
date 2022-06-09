import { render, screen } from '@testing-library/react';
import LeaderBoard from './LeaderBoard';

test('renders leadedr board', () => {

    const tileName = 'Selection Name';
    const tileSrc = './somewhere/pic.png';
    const tileAlt = 'nice picture';

    // TODO test leader board
    // render(
    //     <LeaderBoard name={tileName} src={tileSrc} alt={tileAlt}/>
    // );
    // const nameElement = screen.getByText(new RegExp(tileName));
    // expect(nameElement).toBeInTheDocument();

    // const imgElement = screen.getByAltText(new RegExp(tileAlt));
    // expect(imgElement).toBeInTheDocument();

});
