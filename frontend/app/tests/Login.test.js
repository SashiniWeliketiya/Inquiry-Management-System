import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App'; 

test('renders Coffee Ninja portal branding or login form', () => {
  render(<App />);
  const brandElement = screen.getByText(/Coffee Ninja/i);
  expect(brandElement).toBeInTheDocument();
});