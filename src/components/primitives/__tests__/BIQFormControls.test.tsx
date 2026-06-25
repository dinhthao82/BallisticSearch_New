import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { BIQCheckbox, BIQRadio, BIQSwitch, BIQBadge, BIQ_STATUS_COLOR } from '..';
import { mantineTheme } from '@/theme/mantineTheme';

function ui(node: React.ReactNode) {
  return <MantineProvider theme={mantineTheme}>{node}</MantineProvider>;
}

describe('BIQCheckbox', () => {
  it('renders with label', () => {
    render(ui(<BIQCheckbox label="Agree" />));
    expect(screen.getByLabelText('Agree')).toBeInTheDocument();
  });

  it('respects checked prop', () => {
    render(ui(<BIQCheckbox label="On" checked readOnly />));
    expect(screen.getByLabelText('On')).toBeChecked();
  });

  it('exposes Group as Checkbox.Group with controlled value', () => {
    render(
      ui(
        <BIQCheckbox.Group value={['a']} onChange={() => {}}>
          <BIQCheckbox value="a" label="Alpha" />
          <BIQCheckbox value="b" label="Bravo" />
        </BIQCheckbox.Group>
      )
    );
    expect(screen.getByLabelText('Alpha')).toBeChecked();
    expect(screen.getByLabelText('Bravo')).not.toBeChecked();
  });

  it('exposes Indicator and Card subcomponents', () => {
    expect(BIQCheckbox.Indicator).toBeDefined();
    expect(BIQCheckbox.Card).toBeDefined();
  });
});

describe('BIQRadio', () => {
  it('renders Group with selected value', () => {
    render(
      ui(
        <BIQRadio.Group value="a" onChange={() => {}}>
          <BIQRadio value="a" label="Alpha" />
          <BIQRadio value="b" label="Bravo" />
        </BIQRadio.Group>
      )
    );
    expect(screen.getByLabelText('Alpha')).toBeChecked();
    expect(screen.getByLabelText('Bravo')).not.toBeChecked();
  });
});

describe('BIQSwitch', () => {
  it('renders with label', () => {
    render(ui(<BIQSwitch label="Notify" />));
    expect(screen.getByLabelText('Notify')).toBeInTheDocument();
  });

  it('respects checked prop', () => {
    render(ui(<BIQSwitch label="On" checked readOnly />));
    expect(screen.getByLabelText('On')).toBeChecked();
  });
});

describe('BIQBadge', () => {
  it('renders children verbatim', () => {
    render(ui(<BIQBadge>Hello</BIQBadge>));
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders status text when no children given', () => {
    render(ui(<BIQBadge status="Pending" />));
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('status color map covers Pending / In Process / Closed (display + id forms)', () => {
    expect(BIQ_STATUS_COLOR['Pending']).toBe('yellow');
    expect(BIQ_STATUS_COLOR['In Process']).toBe('blue');
    expect(BIQ_STATUS_COLOR['Closed']).toBe('gray');
    expect(BIQ_STATUS_COLOR['pending']).toBe('yellow');
    expect(BIQ_STATUS_COLOR['inProcess']).toBe('blue');
    expect(BIQ_STATUS_COLOR['closed']).toBe('gray');
  });

  describe('status precedence + dev-warn', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('warns and uses status when both status and color are set', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render(ui(<BIQBadge status="Pending" color="red" />));
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(warn).toHaveBeenCalledOnce();
      expect(warn.mock.calls[0]?.[0]).toMatch(/both 'status'.*and 'color'/);
    });

    it('uses color silently when only color is set', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render(ui(<BIQBadge color="red">Just color</BIQBadge>));
      expect(warn).not.toHaveBeenCalled();
    });
  });
});
