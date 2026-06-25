import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { createRef } from 'react';
import { BIQTextarea } from '../BIQTextarea';
import { mantineTheme } from '@/theme/mantineTheme';

function ui(node: React.ReactNode) {
  return <MantineProvider theme={mantineTheme}>{node}</MantineProvider>;
}

describe('BIQTextarea', () => {
  it('renders with label', () => {
    render(ui(<BIQTextarea label="Notes" />));
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(ui(<BIQTextarea label="N" error="Too long" />));
    expect(screen.getByText('Too long')).toBeInTheDocument();
  });

  it('forwards onChange', () => {
    const onChange = vi.fn();
    render(ui(<BIQTextarea label="N" onChange={onChange} />));
    fireEvent.change(screen.getByLabelText('N'), { target: { value: 'abc' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('forwards ref to underlying HTMLTextAreaElement', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(ui(<BIQTextarea label="N" ref={ref} />));
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
