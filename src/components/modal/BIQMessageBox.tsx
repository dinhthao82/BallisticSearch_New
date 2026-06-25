import { useEffect, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MantineProvider, Group, Text, ThemeIcon } from '@mantine/core';
import {
  IconInfoCircle,
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle,
} from '@tabler/icons-react';
import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner';
import { BIQModal } from './BIQModal';
import { BIQButton } from '@/components/primitives';
import { mantineTheme } from '@/theme/mantineTheme';

export type MessageVariant = 'info' | 'success' | 'warning' | 'error' | 'alert';

export interface BIQMessageBoxOptions {
  title?: string;
  /** Auto-close in ms; 0 / undefined = manual close only. */
  timeout?: number;
  onClose?: () => void;
}

const VARIANT_META: Record<
  MessageVariant,
  { color: string; title: string; Icon: typeof IconInfoCircle }
> = {
  info: { color: 'blue', title: 'Information', Icon: IconInfoCircle },
  success: { color: 'green', title: 'Success', Icon: IconCircleCheck },
  warning: { color: 'yellow', title: 'Warning', Icon: IconAlertTriangle },
  error: { color: 'red', title: 'Error', Icon: IconAlertCircle },
  alert: { color: 'gray', title: 'Ballistics IQ', Icon: IconAlertCircle },
};

/**
 * Coerces any value to a displayable string. Mirrors the legacy
 * MessageBox.js `_msgToString` walk so ported pages that accidentally
 * pass Error/XHR/response objects render something readable instead of
 * "[object Object]".
 */
export function coerceMessage(val: unknown): string {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (val instanceof Error) return val.message || val.toString();
  if (typeof val === 'object') {
    const keys = [
      'msg',
      'message',
      'Message',
      'error',
      'Error',
      'errorMessage',
      'statusText',
      'responseText',
      'text',
      'Text',
      'description',
    ];
    const obj = val as Record<string, unknown>;
    for (const k of keys) {
      const v = obj[k];
      if (typeof v === 'string' && v.length > 0) return v;
    }
    try {
      const json = JSON.stringify(val);
      if (json && json !== '{}' && json !== '[]') return json;
    } catch {
      /* circular ref or other JSON failure — fall through */
    }
  }
  return String(val);
}

interface MessageBoxDialogProps extends BIQMessageBoxOptions {
  variant: MessageVariant;
  message: string;
  onResult: () => void;
}

function MessageBoxDialog({
  variant,
  message,
  title,
  timeout,
  onClose,
  onResult,
}: MessageBoxDialogProps) {
  const [opened, setOpened] = useState(true);
  const meta = VARIANT_META[variant];

  useEffect(() => {
    if (!timeout || timeout <= 0) return;
    const id = setTimeout(() => {
      setOpened(false);
      onClose?.();
      onResult();
    }, timeout);
    return () => clearTimeout(id);
  }, [timeout, onClose, onResult]);

  const close = () => {
    setOpened(false);
    onClose?.();
    onResult();
  };

  return (
    <BIQModal
      opened={opened}
      onClose={close}
      title={title ?? meta.title}
      size="sm"
      footer={
        <BIQButton onClick={close} data-testid="biq-msgbox-ok">
          OK
        </BIQButton>
      }
    >
      <Group gap="md" align="flex-start" wrap="nowrap" data-testid={`biq-msgbox-${variant}`}>
        <ThemeIcon color={meta.color} variant="light" size="lg" radius="xl">
          <meta.Icon size={20} />
        </ThemeIcon>
        <Text style={{ flex: 1 }}>{message}</Text>
      </Group>
    </BIQModal>
  );
}

function show(
  variant: MessageVariant,
  raw: unknown,
  options?: BIQMessageBoxOptions
): Promise<void> {
  return new Promise<void>((resolve) => {
    if (typeof document === 'undefined') {
      resolve();
      return;
    }
    const message = coerceMessage(raw);
    const container = document.createElement('div');
    container.setAttribute('data-biq-msgbox-host', '');
    document.body.appendChild(container);
    const root: Root = createRoot(container);

    const cleanup = () => {
      queueMicrotask(() => {
        root.unmount();
        container.remove();
      });
      resolve();
    };

    root.render(
      <MantineProvider theme={mantineTheme}>
        <MessageBoxDialog
          variant={variant}
          message={message}
          title={options?.title}
          timeout={options?.timeout}
          onClose={options?.onClose}
          onResult={cleanup}
        />
      </MantineProvider>
    );
  });
}

/**
 * Imperative message dialogs. Drop-in replacement for legacy
 * MessageInfo/MessageWarning/MessageError + window.alert.
 */
export const messageBox = {
  alert: (msg: unknown, opts?: BIQMessageBoxOptions) => show('alert', msg, opts),
  info: (msg: unknown, opts?: BIQMessageBoxOptions) => show('info', msg, opts),
  success: (msg: unknown, opts?: BIQMessageBoxOptions) => show('success', msg, opts),
  warn: (msg: unknown, opts?: BIQMessageBoxOptions) => show('warning', msg, opts),
  warning: (msg: unknown, opts?: BIQMessageBoxOptions) => show('warning', msg, opts),
  error: (msg: unknown, opts?: BIQMessageBoxOptions) => show('error', msg, opts),
  toast: {
    info: (msg: unknown) => sonnerToast.info(coerceMessage(msg)),
    success: (msg: unknown) => sonnerToast.success(coerceMessage(msg)),
    warn: (msg: unknown) => sonnerToast.warning(coerceMessage(msg)),
    warning: (msg: unknown) => sonnerToast.warning(coerceMessage(msg)),
    error: (msg: unknown) => sonnerToast.error(coerceMessage(msg)),
  },
};

export { SonnerToaster as BIQToaster };
