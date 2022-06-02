import { render, screen } from '@testing-library/react';
import Main from './Main';

test('renders main', () => {
    render(<Main />);
    // TODO main test
    // const rulesElement = screen.getByText(/Rules/i);
    // expect(rulesElement).toBeInTheDocument();

    // const settingsElement = screen.getByText(/Settings/i);
    // expect(settingsElement).toBeInTheDocument();
});
