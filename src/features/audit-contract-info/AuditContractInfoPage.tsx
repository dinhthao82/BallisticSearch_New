import { Container, Stack, Title, Text, Group, SimpleGrid } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { EmptyState, ErrorState } from '@/components/feedback';
import { ContractSidePanel } from './ContractSidePanel';
import { ChangesTable } from './ChangesTable';
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

  const data = query.data;
  if (!data) return null;

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Stack gap="xs">
          <Title order={3} c="biq.7">
            Contract Audit
          </Title>
          <Group gap="md">
            <Text size="sm" c="dimmed">
              Contract: <strong>{data.contractId}</strong>
            </Text>
            <Text size="sm" c="dimmed">
              Audited by <strong>{data.auditedBy}</strong> on{' '}
              {new Date(data.auditedAt).toLocaleString()}
            </Text>
          </Group>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <ContractSidePanel label="Old contract" contract={data.oldContract} />
          <ContractSidePanel label="New contract" contract={data.newContract} />
        </SimpleGrid>

        <Stack gap="xs">
          <Title order={5}>Changes</Title>
          <ChangesTable changes={data.changes} />
        </Stack>
      </Stack>
    </Container>
  );
}
