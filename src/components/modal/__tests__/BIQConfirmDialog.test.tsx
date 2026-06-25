import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { confirm } from '../BIQConfirmDialog';

afterEach(() => {
  document.querySelectorAll('[data-biq-confirm-host]').forEach((el) => el.remove());
});

describe('confirm() imperative API', () => {
  it('resolves true when OK button clicked', async () => {
    const p = confirm({ title: 'Proceed?', message: 'Are you sure?' });
    const okBtn = await screen.findByTestId('biq-confirm-ok');
    fireEvent.click(okBtn);
    await expect(p).resolves.toBe(true);
  });

  it('resolves false when Cancel button clicked', async () => {
    const p = confirm({ title: 'Proceed?', message: 'Are you sure?' });
    const cancelBtn = await screen.findByTestId('biq-confirm-cancel');
    fireEvent.click(cancelBtn);
    await expect(p).resolves.toBe(false);
  });

  it('resolves false on ESC keydown (BIQModal closeOnEscape)', async () => {
    const p = confirm({ title: 'Proceed?', message: 'Are you sure?' });
    await screen.findByTestId('biq-confirm-ok');
    fireEvent.keyDown(document.body, { key: 'Escape' });
    await expect(p).resolves.toBe(false);
  });

  it('uses custom confirmLabel + cancelLabel', async () => {
    const p = confirm({
      title: 'Delete?',
      message: 'This cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      danger: true,
    });
    expect(await screen.findByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('biq-confirm-cancel'));
    await expect(p).resolves.toBe(false);
  });

  it('unmounts the host node after resolution', async () => {
    const p = confirm({ title: 'X', message: 'Y' });
    const okBtn = await screen.findByTestId('biq-confirm-ok');
    fireEvent.click(okBtn);
    await p;
    await waitFor(() => {
      expect(document.querySelector('[data-biq-confirm-host]')).toBeNull();
    });
  });
});
