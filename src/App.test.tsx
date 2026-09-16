import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import App from './App';

describe('App Scaffolding', () => {
  it('renders header with app title', () => {
    render(<App />);
    expect(screen.getByText('HTML Project Studio')).toBeInTheDocument();
  });
});
