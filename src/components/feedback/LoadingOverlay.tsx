import { LoadingOverlay as MantineLoadingOverlay } from '@mantine/core';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

/**
 * Modal-style loading veil. Wraps Mantine LoadingOverlay.
 * Mirrors legacy `EIQ_LoadingUI.js` (BS-6159).
 */
export function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  return (
    <MantineLoadingOverlay
      visible={visible}
      data-testid="loading-overlay"
      zIndex={1000}
      overlayProps={{ blur: 1 }}
      loaderProps={message ? { children: message } : undefined}
    />
  );
}
