import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { ConsolePanel } from './ConsolePanel';
import { ConsoleLogMessage } from '../../types/vfs';

describe('ConsolePanel component', () => {
  const mockLogs: ConsoleLogMessage[] = [
    {
      id: '1',
      level: 'log',
      message: 'App initialized successfully',
      timestamp: Date.now(),
    },
    {
      id: '2',
      level: 'error',
      message: 'Uncaught TypeError: Cannot read property of undefined',
      timestamp: Date.now(),
    },
  ];

  it('renders log messages and filter buttons', () => {
    const onClearLogs = vi.fn();
    const onClose = vi.fn();

    render(
      <ConsolePanel
        logs={mockLogs}
        isOpen={true}
        onClearLogs={onClearLogs}
        onClose={onClose}
      />
    );

    expect(screen.getByText('App initialized successfully')).toBeInTheDocument();
    expect(screen.getByText('Uncaught TypeError: Cannot read property of undefined')).toBeInTheDocument();

    const clearBtn = screen.getByTitle('Clear Console');
    fireEvent.click(clearBtn);
    expect(onClearLogs).toHaveBeenCalled();
  });
});
