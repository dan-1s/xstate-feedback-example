import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders xstate header', () => {
  const { getByText } = render(<App />);
  const el = getByText(/xstate/i);
  expect(el).toBeInTheDocument();
});
