import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { createRef } from 'react';
import { BIQButton } from '../BIQButton';
import { mantineTheme } from '@/theme/mantineTheme';

function ui(node: React.ReactNode) {
  return <MantineProvider theme={mantineTheme}>{node}</MantineProvider>;
}

describe('BIQButton', () => {
  it('renders children', () => {
    render(ui(<BIQButton>Click me</BIQButton>));
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('forwards click handler', () => {
    const onClick = vi.fn();
    render(ui(<BIQButton onClick={onClick}>Go</BIQButton>));
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref to underlying HTMLButtonElement', () => {
    const ref = createRef<HTMLButtonElement>();
    render(ui(<BIQButton ref={ref}>Ref</BIQButton>));
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('disables when disabled prop set', () => {
    render(ui(<BIQButton disabled>Stop</BIQButton>));
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('supports polymorphic component prop (renders as anchor)', () => {
    render(
      ui(
        <BIQButton component="a" href="/dest">
          Linked
        </BIQButton>
      )
    );
    const link = screen.getByRole('link', { name: /linked/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dest');
  });
});
