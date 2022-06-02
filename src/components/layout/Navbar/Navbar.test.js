import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

test('renders navbar', () => {
    render(
        <BrowserRouter>
            <Navbar />
        </BrowserRouter>
    );
    const rulesElement = screen.getByText(/Rules/i);
    expect(rulesElement).toBeInTheDocument();

    const settingsElement = screen.getByText(/Settings/i);
    expect(settingsElement).toBeInTheDocument();
});
