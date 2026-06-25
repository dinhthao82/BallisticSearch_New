import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { createRef } from 'react';
import { BIQMultiselect } from '../BIQMultiselect';
import { mantineTheme } from '@/theme/mantineTheme';

function ui(node: React.ReactNode) {
  return <MantineProvider theme={mantineTheme}>{node}</MantineProvider>;
}

// Mantine MultiSelect renders both a visible <input> (the searchable box)
// and a hidden <input type="hidden"> for native form fallback, both sharing
// the same label association. getByRole('searchbox') picks the visible one.
function searchbox(): HTMLInputElement {
  // Mantine MultiSelect renders both a hidden form input and a visible text
  // input that share the same label. Picking by tag + non-hidden type
  // disambiguates without depending on aria roles (Mantine uses combobox
  // semantics on the wrapper, not the input itself).
  const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input'));
  const visible = inputs.find((el) => el.type !== 'hidden');
  if (!visible) throw new Error('BIQMultiselect: no visible input rendered');
  return visible;
}

const opts = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Bravo' },
  { value: 'c', label: 'Charlie' },
];

describe('BIQMultiselect', () => {
  it('renders the visible search input', () => {
    render(ui(<BIQMultiselect label="Tags" placeholder="Pick some" data={opts} value={[]} />));
    expect(searchbox()).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  it('shows currently-selected pills for controlled value', () => {
    render(ui(<BIQMultiselect label="Tags" data={opts} value={['a', 'b']} />));
    // Mantine renders selected pills as visible chips; the option list is
    // collapsed until the user clicks the input, so each label appears once.
    expect(screen.getAllByText('Alpha').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bravo').length).toBeGreaterThan(0);
  });

  it('fires onChange when an option is picked from the dropdown', () => {
    const onChange = vi.fn();
    render(ui(<BIQMultiselect label="Tags" data={opts} value={[]} onChange={onChange} />));
    fireEvent.click(searchbox());
    fireEvent.click(screen.getByText('Charlie'));
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0]?.[0]).toEqual(['c']);
  });

  it('forwards ref to underlying HTMLInputElement', () => {
    const ref = createRef<HTMLInputElement>();
    render(ui(<BIQMultiselect label="Tags" data={opts} value={[]} ref={ref} />));
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('portals dropdown listbox to document.body by default (withinPortal=true)', () => {
    render(ui(<BIQMultiselect label="Tags" data={opts} value={[]} />));
    fireEvent.click(searchbox());
    const listbox = document.body.querySelector('[role="listbox"]');
    expect(listbox).toBeTruthy();
    // Confirm it's NOT nested inside our wrapper — withinPortal means
    // Mantine renders the dropdown directly off body.
    const wrapper = screen.getByText('Tags').closest('[class*="mantine-MultiSelect"]');
    expect(wrapper?.querySelector('[role="listbox"]')).toBeNull();
  });

  it('searchable on by default — typing filters the option list', () => {
    render(ui(<BIQMultiselect label="Tags" data={opts} value={[]} />));
    const input = searchbox();
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'brav' } });
    expect(screen.getByText('Bravo')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
  });
});
