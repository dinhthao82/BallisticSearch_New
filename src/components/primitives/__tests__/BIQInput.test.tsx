import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { createRef } from 'react';
import { BIQInput } from '../BIQInput';
import { mantineTheme } from '@/theme/mantineTheme';

function ui(node: React.ReactNode) {
  return <MantineProvider theme={mantineTheme}>{node}</MantineProvider>;
}

describe('BIQInput', () => {
  it('renders with label', () => {
    render(ui(<BIQInput label="Username" />));
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(ui(<BIQInput label="Email" error="Required" />));
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('forwards onChange', () => {
    const onChange = vi.fn();
    render(ui(<BIQInput label="Name" onChange={onChange} />));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'hi' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('forwards ref to underlying HTMLInputElement', () => {
    const ref = createRef<HTMLInputElement>();
    render(ui(<BIQInput label="Ref" ref={ref} />));
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
