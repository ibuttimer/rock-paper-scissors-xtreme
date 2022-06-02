import { render, screen } from '@testing-library/react';
import Rules from './Rules';

test('renders rules', () => {
    render(<Rules />);
    // TODO rules test
    // const rulesElement = screen.getByText(/Rules/i);
    // expect(rulesElement).toBeInTheDocument();

    // const settingsElement = screen.getByText(/Settings/i);
    // expect(settingsElement).toBeInTheDocument();
});
