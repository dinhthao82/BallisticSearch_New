import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GCTWindow, LegacyAdapterError } from '../GCTWindow';

// messageBox uses createRoot + queueMicrotask cleanup; vitest's afterEach
// fires before pending microtasks flush, so we both pre-clear (beforeEach)
// and post-clear (afterEach) so the next test starts with an empty DOM.
beforeEach(() => {
  document.querySelectorAll('[data-biq-msgbox-host]').forEach((el) => el.remove());
});
afterEach(async () => {
  await new Promise((r) => setTimeout(r, 10));
  document.querySelectorAll('[data-biq-msgbox-host]').forEach((el) => el.remove());
});

describe('GCTWindow legacy adapter — message methods', () => {
  it('MessageBox({msgType:"info"}) renders info variant', async () => {
    GCTWindow.MessageBox({ msg: 'Hi', msgType: 'info', title: 'Notice' });
    expect(await screen.findByText('Hi')).toBeInTheDocument();
    expect(screen.getByTestId('biq-msgbox-info')).toBeInTheDocument();
    expect(screen.getByText('Notice')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('biq-msgbox-ok'));
    await waitFor(() => expect(document.querySelector('[data-biq-msgbox-host]')).toBeNull());
  });

  it('MessageBox_Language(msg, title, ..., msgType="error") renders error variant', async () => {
    GCTWindow.MessageBox_Language('Failure', 'Oops', 300, 200, [], '', null, 'error');
    expect(await screen.findByText('Failure')).toBeInTheDocument();
    expect(screen.getByTestId('biq-msgbox-error')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('biq-msgbox-ok'));
    await waitFor(() => expect(document.querySelector('[data-biq-msgbox-host]')).toBeNull());
  });

  it('MessageBoxNoRecord maps to info variant', async () => {
    GCTWindow.MessageBoxNoRecord('No records', 'Empty');
    expect(await screen.findByText('No records')).toBeInTheDocument();
    expect(screen.getByTestId('biq-msgbox-info')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('biq-msgbox-ok'));
    await waitFor(() => expect(document.querySelector('[data-biq-msgbox-host]')).toBeNull());
  });

  it('fires legacy fClick callback from actions on OK click', async () => {
    const fClick = vi.fn();
    GCTWindow.MessageBox_Language(
      'Hello',
      'T',
      0,
      0,
      [{ name: 'OK', fClick, isClose: true }],
      '',
      null,
      'info'
    );
    fireEvent.click(await screen.findByTestId('biq-msgbox-ok'));
    await waitFor(() => expect(fClick).toHaveBeenCalled());
  });

  it('closeMessage() force-removes any open message hosts', async () => {
    GCTWindow.MessageBox({ msg: 'Persistent', msgType: 'warning' });
    await screen.findByTestId('biq-msgbox-warning');
    GCTWindow.closeMessage();
    await waitFor(() => {
      expect(document.querySelector('[data-biq-msgbox-host]')).toBeNull();
    });
  });
});

describe('GCTWindow legacy adapter — deferred iframe methods', () => {
  it.each([
    ['open'],
    ['openNew'],
    ['openDashboard'],
    ['OpenWindowSchedule'],
    ['jWindow'],
    ['jWindow_Wrap'],
    ['close'],
  ] as const)('%s throws LegacyAdapterError', (method) => {
    expect(() => (GCTWindow[method] as () => unknown)()).toThrow(LegacyAdapterError);
    expect(() => (GCTWindow[method] as () => unknown)()).toThrow(/Port the wrapped page first/);
  });
});

// Note on accessibility coverage: the OK button is a real Mantine Button
// (BIQModal focus trap + Mantine Button keyboard handling), and the title
// renders as Mantine Modal's heading. Both are verified upstream in
// BIQModal.test.tsx (focus trap, ESC) and BIQMessageBox.test.tsx (button
// role, custom title). No new accessibility surface lives in this adapter
// — it forwards arguments to messageBox.*, so duplicating the a11y
// assertions here is redundant.
