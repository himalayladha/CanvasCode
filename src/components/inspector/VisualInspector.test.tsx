import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VisualInspector } from './VisualInspector';
import { InspectedElementData } from '../../types/vfs';

describe('VisualInspector component', () => {
  const mockSelectedElement: InspectedElementData = {
    tagName: 'h1',
    id: 'hero-title',
    classList: ['hero-title', 'gradient-text'],
    selector: '#hero-title',
    innerText: 'Grow Your Business',
    attributes: { class: 'hero-title gradient-text', id: 'hero-title' },
    computedStyles: {
      color: 'rgb(255, 255, 255)',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      fontSize: '48px',
      fontWeight: '800',
      textAlign: 'center',
      margin: '20px 0px',
      padding: '0px',
      border: 'none',
      borderRadius: '0px',
      width: '640px',
      height: '64px',
      display: 'block',
    },
    boxModel: {
      marginTop: '20px',
      marginRight: '0px',
      marginBottom: '20px',
      marginLeft: '0px',
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
    },
    rect: { top: 100, left: 150, width: 640, height: 64 },
  };

  it('renders selected element details (tag, text, font-size, color)', () => {
    const onUpdateStyle = vi.fn();
    const onUpdateText = vi.fn();
    const onClose = vi.fn();

    render(
      <VisualInspector
        selectedElement={mockSelectedElement}
        onUpdateStyle={onUpdateStyle}
        onUpdateText={onUpdateText}
        onClose={onClose}
      />
    );

    expect(screen.getByText('h1')).toBeInTheDocument();
    expect(screen.getAllByText('#hero-title').length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue('Grow Your Business')).toBeInTheDocument();

    const textInput = screen.getByDisplayValue('Grow Your Business');
    fireEvent.change(textInput, { target: { value: 'New Heading Text' } });
    expect(onUpdateText).toHaveBeenCalledWith('New Heading Text');
  });

  it('triggers onChangeTag, onMoveUp, onMoveDown, onDuplicateElement, and onDeleteElement', () => {
    const onChangeTag = vi.fn();
    const onMoveUp = vi.fn();
    const onMoveDown = vi.fn();
    const onDuplicateElement = vi.fn();
    const onDeleteElement = vi.fn();

    render(
      <VisualInspector
        selectedElement={mockSelectedElement}
        onUpdateStyle={vi.fn()}
        onUpdateText={vi.fn()}
        onChangeTag={onChangeTag}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicateElement={onDuplicateElement}
        onDeleteElement={onDeleteElement}
        onClose={vi.fn()}
      />
    );

    // Change Tag
    const tagSelect = screen.getByTitle('Change Element HTML Tag');
    fireEvent.change(tagSelect, { target: { value: 'h2' } });
    expect(onChangeTag).toHaveBeenCalledWith('h2');

    // Move Up
    const moveUpBtn = screen.getByTitle('Move Element Up in DOM');
    fireEvent.click(moveUpBtn);
    expect(onMoveUp).toHaveBeenCalled();

    // Move Down
    const moveDownBtn = screen.getByTitle('Move Element Down in DOM');
    fireEvent.click(moveDownBtn);
    expect(onMoveDown).toHaveBeenCalled();

    // Duplicate
    const dupBtn = screen.getByTitle('Duplicate Element');
    fireEvent.click(dupBtn);
    expect(onDuplicateElement).toHaveBeenCalled();

    // Delete
    const delBtn = screen.getByTitle('Delete Element');
    fireEvent.click(delBtn);
    expect(onDeleteElement).toHaveBeenCalled();
  });

  it('renders empty state when no element is selected', () => {
    render(
      <VisualInspector
        selectedElement={null}
        onUpdateStyle={vi.fn()}
        onUpdateText={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/No element selected/i)).toBeInTheDocument();
  });
});

