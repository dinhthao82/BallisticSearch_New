import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { messageBox, coerceMessage } from '../BIQMessageBox';

afterEach(() => {
  document.querySelectorAll('[data-biq-msgbox-host]').forEach((el) => el.remove());
});

describe('coerceMessage', () => {
  it('returns strings verbatim', () => {
    expect(coerceMessage('hi')).toBe('hi');
  });

  it('coerces numbers and booleans', () => {
    expect(coerceMessage(42)).toBe('42');
    expect(coerceMessage(true)).toBe('true');
  });

  it('extracts Error.message', () => {
    expect(coerceMessage(new Error('boom'))).toBe('boom');
  });

  it('walks known error-shape keys (msg, message, statusText)', () => {
    expect(coerceMessage({ message: 'API failed' })).toBe('API failed');
    expect(coerceMessage({ statusText: 'Not Found' })).toBe('Not Found');
    expect(coerceMessage({ responseText: 'Server error' })).toBe('Server error');
  });

  it('falls back to JSON for unknown object shape', () => {
    expect(coerceMessage({ foo: 1 })).toBe('{"foo":1}');
  });

  it('returns empty string for null/undefined', () => {
    expect(coerceMessage(null)).toBe('');
    expect(coerceMessage(undefined)).toBe('');
  });
});

describe('messageBox imperative variants', () => {
  it('info: renders info icon + message; OK resolves', async () => {
    const p = messageBox.info('Hello info');
    expect(await screen.findByText('Hello info')).toBeInTheDocument();
    expect(screen.getByTestId('biq-msgbox-info')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('biq-msgbox-ok'));
    await expect(p).resolves.toBeUndefined();
  });

  it('warn: renders warning variant container', async () => {
    const p = messageBox.warn('Careful');
    expect(await screen.findByText('Careful')).toBeInTheDocument();
    expect(screen.getByTestId('biq-msgbox-warning')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('biq-msgbox-ok'));
    await p;
  });

  it('error: renders error variant container', async () => {
    const p = messageBox.error('Boom');
    expect(await screen.findByText('Boom')).toBeInTheDocument();
    expect(screen.getByTestId('biq-msgbox-error')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('biq-msgbox-ok'));
    await p;
  });

  it('alert: accepts a non-string and coerces via coerceMessage', async () => {
    const p = messageBox.alert(new Error('network down'));
    expect(await screen.findByText('network down')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('biq-msgbox-ok'));
    await p;
  });

  it('custom title overrides variant default', async () => {
    const p = messageBox.info('msg', { title: 'Custom Title' });
    expect(await screen.findByText('Custom Title')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('biq-msgbox-ok'));
    await p;
  });

  it('timeout auto-closes and fires onClose', async () => {
    const onClose = vi.fn();
    const p = messageBox.info('Auto', { timeout: 50, onClose });
    await screen.findByText('Auto');
    await waitFor(() => expect(onClose).toHaveBeenCalled(), { timeout: 500 });
    await p;
  });

  it('host node removed after resolution (no DOM leak)', async () => {
    const p = messageBox.info('Cleanup');
    await screen.findByTestId('biq-msgbox-ok');
    fireEvent.click(screen.getByTestId('biq-msgbox-ok'));
    await p;
    await waitFor(() => {
      expect(document.querySelector('[data-biq-msgbox-host]')).toBeNull();
    });
  });
});
