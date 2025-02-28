import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TodoApp', () => {
    render(<App />);
    const headingElement = screen.getByText(/tasks list/i); // Check for the heading in TodoApp
    expect(headingElement).toBeInTheDocument();
});
