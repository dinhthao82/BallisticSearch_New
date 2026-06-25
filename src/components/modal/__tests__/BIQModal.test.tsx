import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { BIQModal } from '../BIQModal';
import { BIQButton } from '@/components/primitives';
import { mantineTheme } from '@/theme/mantineTheme';

function ui(node: React.ReactNode) {
  return <MantineProvider theme={mantineTheme}>{node}</MantineProvider>;
}

describe('BIQModal', () => {
  it('renders title + body + footer when opened', () => {
    render(
      ui(
        <BIQModal
          opened
          onClose={() => {}}
          title="Delete record?"
          footer={
            <>
              <BIQButton variant="default">Cancel</BIQButton>
              <BIQButton color="red">Delete</BIQButton>
            </>
          }
        >
          This action cannot be undone.
        </BIQModal>
      )
    );
    expect(screen.getByText('Delete record?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByTestId('biq-modal-footer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('does not render footer slot when footer prop omitted', () => {
    render(
      ui(
        <BIQModal opened onClose={() => {}} title="Plain">
          Body only
        </BIQModal>
      )
    );
    expect(screen.queryByTestId('biq-modal-footer')).not.toBeInTheDocument();
  });

  it('fires onClose on ESC keydown by default', () => {
    const onClose = vi.fn();
    render(
      ui(
        <BIQModal opened onClose={onClose} title="X">
          body
        </BIQModal>
      )
    );
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('does NOT close on backdrop click (default closeOnClickOutside=false)', () => {
    const onClose = vi.fn();
    render(
      ui(
        <BIQModal opened onClose={onClose} title="X">
          body
        </BIQModal>
      )
    );
    const overlay = document.querySelector('.mantine-Modal-overlay');
    if (overlay) fireEvent.click(overlay);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders nothing when opened=false', () => {
    render(
      ui(
        <BIQModal opened={false} onClose={() => {}} title="Hidden">
          body
        </BIQModal>
      )
    );
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    expect(screen.queryByText('body')).not.toBeInTheDocument();
  });

  it('returns focus to the trigger element after close', async () => {
    function Harness() {
      const [opened, setOpened] = useState(false);
      return (
        <>
          <button data-testid="trigger" onClick={() => setOpened(true)}>
            open
          </button>
          <BIQModal opened={opened} onClose={() => setOpened(false)} title="X">
            body
          </BIQModal>
        </>
      );
    }
    render(ui(<Harness />));
    const trigger = screen.getByTestId('trigger');
    trigger.focus();
    fireEvent.click(trigger);
    await screen.findByText('X');
    fireEvent.keyDown(document.body, { key: 'Escape' });
    // Mantine's returnFocus restores focus on close (default behavior + we set it).
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
