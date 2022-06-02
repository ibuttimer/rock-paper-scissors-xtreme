import { render, screen } from '@testing-library/react';
import App from './../../../App';

test('renders navbar', () => {
  render(<App />);
  const rulesElement = screen.getByText(/Rules/i);
  expect(rulesElement).toBeInTheDocument();

  const settingsElement = screen.getByText(/Settings/i);
  expect(settingsElement).toBeInTheDocument();
});
