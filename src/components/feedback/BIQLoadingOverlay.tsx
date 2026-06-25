import { useEffect } from 'react';
import { CloseButton, Group, Loader, Overlay, Paper, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export interface BIQLoadingOverlayProps {
  visible: boolean;
  message?: string;
  onCancel?: () => void;
}

export function BIQLoadingOverlay({ visible, message, onCancel }: BIQLoadingOverlayProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!visible || !onCancel) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, onCancel]);

  if (!visible) return null;

  return (
    <Overlay
      data-testid="biq-loading-overlay"
      zIndex={1000}
      backgroundOpacity={0.2}
      color="#fff"
      fixed
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper shadow="lg" radius="md" p="md" maw={480} miw={200}>
        <Group gap="sm" align="center" wrap="nowrap">
          <Loader size="md" />
          <Text size="lg" style={{ flex: 1 }}>
            {message ?? t('state.loading', { defaultValue: 'Please wait…' })}
          </Text>
          {onCancel && (
            <CloseButton
              onClick={onCancel}
              aria-label={t('button.cancel', { defaultValue: 'Cancel' })}
              data-testid="biq-loading-overlay-cancel"
            />
          )}
        </Group>
      </Paper>
    </Overlay>
  );
}
