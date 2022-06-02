import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('renders copyright', () => {
    render(<Footer />);
    const linkElement = screen.getByText(/©/i);
    expect(linkElement).toBeInTheDocument();
});
