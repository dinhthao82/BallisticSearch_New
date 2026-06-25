import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { createRef } from 'react';
import { BIQSelect } from '../BIQSelect';
import { mantineTheme } from '@/theme/mantineTheme';

function ui(node: React.ReactNode) {
  return <MantineProvider theme={mantineTheme}>{node}</MantineProvider>;
}

const opts = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Bravo' },
];

describe('BIQSelect', () => {
  it('renders options', () => {
    render(ui(<BIQSelect label="Letter" data={opts} />));
    expect(screen.getByRole('option', { name: 'Alpha' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Bravo' })).toBeInTheDocument();
  });

  it('renders a native HTMLSelectElement', () => {
    const ref = createRef<HTMLSelectElement>();
    render(ui(<BIQSelect label="Letter" data={opts} ref={ref} />));
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('fires onChange when value selected', () => {
    const onChange = vi.fn();
    render(ui(<BIQSelect label="Letter" data={opts} onChange={onChange} />));
    fireEvent.change(screen.getByLabelText('Letter'), { target: { value: 'b' } });
    expect(onChange).toHaveBeenCalled();
  });
});
