import { Center, Stack, Text, ThemeIcon, Button } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  message?: string;
  detail?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, detail, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();
  return (
    <Center py="xl" data-testid="error-state">
      <Stack align="center" gap="sm" maw={420}>
        <ThemeIcon size="xl" variant="light" color="red">
          <IconAlertTriangle size={28} />
        </ThemeIcon>
        <Text c="red" fw={600}>
          {message ?? t('state.error')}
        </Text>
        {detail && (
          <Text size="sm" c="dimmed" ta="center">
            {detail}
          </Text>
        )}
        {onRetry && (
          <Button variant="subtle" size="xs" onClick={onRetry}>
            {t('button.next', 'Retry')}
          </Button>
        )}
      </Stack>
    </Center>
  );
}
