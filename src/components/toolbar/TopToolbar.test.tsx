import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { TopToolbar } from './TopToolbar';
import { useProjectStore } from '../../store/useProjectStore';

describe('TopToolbar component', () => {
  beforeEach(() => {
    useProjectStore.getState().resetProject();
  });

  it('renders project name, templates, export and undo/redo buttons', () => {
    render(<TopToolbar />);

    expect(screen.getByText('WebStudio')).toBeInTheDocument();
    expect(screen.getByText('Templates')).toBeInTheDocument();
    expect(screen.getByText('Export ZIP')).toBeInTheDocument();

    const undoBtn = screen.getByTitle(/Undo \(Ctrl\+Z/i);
    const redoBtn = screen.getByTitle(/Redo \(Ctrl\+Y/i);

    expect(undoBtn).toBeInTheDocument();
    expect(redoBtn).toBeInTheDocument();
    expect(undoBtn).toBeDisabled();
    expect(redoBtn).toBeDisabled();
  });

  it('enables undo button when changes are made and triggers undo on click', () => {
    render(<TopToolbar />);

    act(() => {
      useProjectStore.getState().updateFile('index.html', '<h1>New Changed Title</h1>');
    });

    const undoBtn = screen.getByTitle(/Undo \(Ctrl\+Z/i);
    expect(undoBtn).not.toBeDisabled();

    fireEvent.click(undoBtn);
    expect(useProjectStore.getState().files['index.html'].content).not.toContain('New Changed Title');

    const redoBtn = screen.getByTitle(/Redo \(Ctrl\+Y/i);
    expect(redoBtn).not.toBeDisabled();

    fireEvent.click(redoBtn);
    expect(useProjectStore.getState().files['index.html'].content).toContain('New Changed Title');
  });
});
