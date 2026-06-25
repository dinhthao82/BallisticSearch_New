import { Container, Stack, Title, Text } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { EmptyState, ErrorState } from '@/components/feedback';
import { useContractAudit } from './useContractAudit';

export default function AuditContractInfoPage() {
  const [params] = useSearchParams();
  const contractId = params.get('contractId') ?? undefined;
  const query = useContractAudit(contractId);

  if (!contractId) {
    return (
      <Container size="md" py="xl">
        <EmptyState
          title="No contract selected"
          description='Provide a contractId via the URL (e.g. "?contractId=CONTRACT-001").'
        />
      </Container>
    );
  }

  if (query.isLoading) {
    return (
      <Container size="md" py="xl">
        <Text>Loading contract audit info…</Text>
      </Container>
    );
  }

  if (query.isError) {
    return (
      <Container size="md" py="xl">
        <ErrorState
          title="Failed to load contract audit"
          message={query.error instanceof Error ? query.error.message : 'Unknown error'}
          onRetry={() => query.refetch()}
        />
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Contract Audit
        </Title>
        <Text size="sm" c="dimmed">
          Contract ID: <strong>{contractId}</strong>
        </Text>
      </Stack>
    </Container>
  );
}
