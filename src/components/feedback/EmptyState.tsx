import { Center, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  message?: string;
  hint?: string;
}

export function EmptyState({ message, hint }: EmptyStateProps) {
  const { t } = useTranslation();
  return (
    <Center py="xl" data-testid="empty-state">
      <Stack align="center" gap="sm">
        <ThemeIcon size="xl" variant="light" color="gray">
          <IconInbox size={28} />
        </ThemeIcon>
        <Text c="dimmed" fw={500}>
          {message ?? t('state.empty')}
        </Text>
        {hint && (
          <Text size="sm" c="dimmed">
            {hint}
          </Text>
        )}
      </Stack>
    </Center>
  );
}
