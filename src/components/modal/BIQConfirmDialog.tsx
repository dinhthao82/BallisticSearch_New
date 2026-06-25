import { useEffect, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MantineProvider, Text } from '@mantine/core';
import { BIQModal } from './BIQModal';
import { BIQButton } from '@/components/primitives';
import { mantineTheme } from '@/theme/mantineTheme';

export interface BIQConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Danger styling on the confirm button (red); use for destructive actions. */
  danger?: boolean;
}

interface BIQConfirmDialogProps extends BIQConfirmOptions {
  onResult: (ok: boolean) => void;
}

function BIQConfirmDialog({
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  danger = false,
  onResult,
}: BIQConfirmDialogProps) {
  const [opened, setOpened] = useState(true);

  // Auto-focus the confirm button so Enter resolves true; ESC resolves false
  // (handled by BIQModal's closeOnEscape).
  useEffect(() => {
    const btn = document.querySelector<HTMLButtonElement>('[data-testid="biq-confirm-ok"]');
    btn?.focus();
  }, []);

  const close = (ok: boolean) => {
    setOpened(false);
    onResult(ok);
  };

  return (
    <BIQModal
      opened={opened}
      onClose={() => close(false)}
      title={title}
      size="sm"
      footer={
        <>
          <BIQButton
            variant="default"
            onClick={() => close(false)}
            data-testid="biq-confirm-cancel"
          >
            {cancelLabel}
          </BIQButton>
          <BIQButton
            color={danger ? 'red' : undefined}
            onClick={() => close(true)}
            data-testid="biq-confirm-ok"
          >
            {confirmLabel}
          </BIQButton>
        </>
      }
    >
      <Text>{message}</Text>
    </BIQModal>
  );
}

/**
 * Imperative confirm() — drop-in replacement for native window.confirm.
 * Mounts a Mantine-themed BIQModal in a transient DOM root, resolves the
 * returned Promise with the user's choice, then unmounts.
 *
 * Each call creates its own root so concurrent confirm() calls don't trample
 * each other; resolves false if the document is torn down before the user
 * answers (defensive — should not happen in practice).
 */
export function confirm(options: BIQConfirmOptions): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    if (typeof document === 'undefined') {
      resolve(false);
      return;
    }
    const container = document.createElement('div');
    container.setAttribute('data-biq-confirm-host', '');
    document.body.appendChild(container);
    const root: Root = createRoot(container);

    const cleanup = (ok: boolean) => {
      // Defer unmount to next tick so the leave-transition can run and so we
      // don't call root.unmount during React's commit phase.
      queueMicrotask(() => {
        root.unmount();
        container.remove();
      });
      resolve(ok);
    };

    root.render(
      <MantineProvider theme={mantineTheme}>
        <BIQConfirmDialog {...options} onResult={cleanup} />
      </MantineProvider>
    );
  });
}
