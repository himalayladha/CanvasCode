import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Integration', () => {
  it('renders WebStudio toolbar, explorer, editor and live preview header', () => {
    render(<App />);
    expect(screen.getByText('WebStudio')).toBeInTheDocument();
    expect(screen.getByText('Explorer')).toBeInTheDocument();
    expect(screen.getByText('Templates')).toBeInTheDocument();
    expect(screen.getByText('Export ZIP')).toBeInTheDocument();
    expect(screen.getByText(/Inspect Mode/i)).toBeInTheDocument();
  });
});
