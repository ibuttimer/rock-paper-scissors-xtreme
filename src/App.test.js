import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders app', () => {
    render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
    // TODO app test
    //   const linkElement = screen.getByText(/learn react/i);
    //   expect(linkElement).toBeInTheDocument();
});
