import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { TabBar } from './TabBar';

describe('TabBar component', () => {
  it('renders list of open tabs and highlights the active tab', () => {
    const onSelectTab = vi.fn();
    const onCloseTab = vi.fn();

    render(
      <TabBar
        openTabs={['index.html', 'css/style.css']}
        activeFilePath="index.html"
        onSelectTab={onSelectTab}
        onCloseTab={onCloseTab}
      />
    );

    expect(screen.getByText('index.html')).toBeInTheDocument();
    expect(screen.getByText('style.css')).toBeInTheDocument();

    const activeTab = screen.getByTestId('tab-index.html');
    expect(activeTab).toHaveClass('bg-[#1e1e1e]'); // Active tab background

    fireEvent.click(screen.getByText('style.css'));
    expect(onSelectTab).toHaveBeenCalledWith('css/style.css');
  });

  it('triggers onCloseTab when close button is clicked', () => {
    const onSelectTab = vi.fn();
    const onCloseTab = vi.fn();

    render(
      <TabBar
        openTabs={['index.html', 'css/style.css']}
        activeFilePath="index.html"
        onSelectTab={onSelectTab}
        onCloseTab={onCloseTab}
      />
    );

    const closeBtn = screen.getByTestId('close-tab-css/style.css');
    fireEvent.click(closeBtn);

    expect(onCloseTab).toHaveBeenCalledWith('css/style.css');
  });
});
