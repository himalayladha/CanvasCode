import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LayoutControl } from './LayoutControl';

describe('LayoutControl component', () => {
  it('renders display options and triggers onUpdateStyle when display changes', () => {
    const onUpdateStyle = vi.fn();
    render(
      <LayoutControl
        display="block"
        flexDirection="row"
        alignItems="stretch"
        justifyContent="flex-start"
        gap="0px"
        opacity="1"
        onUpdateStyle={onUpdateStyle}
      />
    );

    expect(screen.getByText('Layout & Display')).toBeInTheDocument();
    
    // Switch display to flex
    const flexBtn = screen.getByRole('button', { name: /flex/i });
    fireEvent.click(flexBtn);
    expect(onUpdateStyle).toHaveBeenCalledWith('display', 'flex');
  });

  it('renders flex direction and alignment controls when display is flex', () => {
    const onUpdateStyle = vi.fn();
    render(
      <LayoutControl
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        gap="16px"
        opacity="1"
        onUpdateStyle={onUpdateStyle}
      />
    );

    // Direction column
    const colBtn = screen.getByTitle('Column (Vertical)');
    fireEvent.click(colBtn);
    expect(onUpdateStyle).toHaveBeenCalledWith('flexDirection', 'column');

    // Gap slider
    const gapSlider = screen.getByLabelText(/gap slider/i);
    fireEvent.change(gapSlider, { target: { value: '24' } });
    expect(onUpdateStyle).toHaveBeenCalledWith('gap', '24px');
  });

  it('handles opacity slider changes', () => {
    const onUpdateStyle = vi.fn();
    render(
      <LayoutControl
        display="block"
        opacity="0.8"
        onUpdateStyle={onUpdateStyle}
      />
    );

    const opacitySlider = screen.getByLabelText(/opacity slider/i);
    fireEvent.change(opacitySlider, { target: { value: '50' } });
    expect(onUpdateStyle).toHaveBeenCalledWith('opacity', '0.5');
  });
});
