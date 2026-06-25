import { useState, useCallback } from 'react';
import {
  Container,
  Stack,
  Title,
  Group,
  Text,
  Table,
  Radio,
  Tabs,
  Textarea,
  Checkbox,
} from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BIQBadge, BIQButton, BIQInput } from '@/components/primitives';
import { BIQModal, messageBox } from '@/components/modal';
import { BIQLoadingOverlay, ErrorState } from '@/components/feedback';
import { api } from '@/api/client';

interface VCCItem {
  id: string;
  caseNumber: string;
  status: 'Pending' | 'In Process' | 'Closed';
  examiner: string;
  comment: string;
  createdAt: string;
}

interface VCCResponse {
  items: VCCItem[];
  total: number;
}

const STANDARD_VERBIAGE = [
  'No match.',
  'Possible match — requires further examination.',
  'Confirmed match.',
  'Inconclusive due to evidence quality.',
];

const VCC_QUERY_KEY = ['vcc'] as const;

export default function VCCPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [verbiageOpen, setVerbiageOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [selectedVCC, setSelectedVCC] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [notifyExaminers, setNotifyExaminers] = useState(true);
  const [reportType, setReportType] = useState<'CSA' | 'QA' | 'PLR'>('CSA');

  const query = useQuery({
    queryKey: [...VCC_QUERY_KEY, search],
    queryFn: ({ signal }) =>
      api.get('vcc', { searchParams: search ? { search } : {}, signal }).json<VCCResponse>(),
    staleTime: 30_000,
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: { id: string; comment: string; notifyExaminers: boolean }) =>
      api.post('vcc/save', { json: payload }).json<{ ok: boolean }>(),
  });

  const handleCancel = useCallback(() => {
    void qc.cancelQueries({ queryKey: [...VCC_QUERY_KEY] });
  }, [qc]);

  const handleSave = async () => {
    if (!selectedVCC) {
      await messageBox.warn('Select a VCC first.');
      return;
    }
    try {
      await saveMutation.mutateAsync({
        id: selectedVCC,
        comment,
        notifyExaminers,
      });
      await messageBox.success('VCC saved + examiners notified.');
      setNotifyOpen(false);
      setComment('');
    } catch (err) {
      await messageBox.error(err instanceof Error ? err.message : 'Save failed.');
    }
  };

  function statusColor(s: VCCItem['status']) {
    if (s === 'Closed') return 'gray';
    if (s === 'In Process') return 'blue';
    return 'yellow';
  }

  return (
    <Container size="xl" py="xl">
      <BIQLoadingOverlay
        visible={query.isFetching}
        message="Loading VCC list…"
        onCancel={handleCancel}
      />
      <Stack gap="md">
        <Title order={3} c="biq.7">
          VCC — Verification of Cartridge Cases
        </Title>

        <Group gap="sm">
          <BIQInput
            label="Search by case # / examiner"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <BIQButton
            variant="default"
            size="sm"
            mt={24}
            disabled={!selectedVCC}
            onClick={() => setVerbiageOpen(true)}
          >
            Standard Verbiage
          </BIQButton>
          <BIQButton
            variant="filled"
            size="sm"
            mt={24}
            disabled={!selectedVCC}
            onClick={() => setNotifyOpen(true)}
          >
            Save + Notify
          </BIQButton>
        </Group>

        {query.isError && (
          <ErrorState
            message="Failed to load VCC list"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}

        {query.data && query.data.items.length > 0 && (
          <Table withTableBorder striped highlightOnHover stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Select</Table.Th>
                <Table.Th>ID</Table.Th>
                <Table.Th>Case #</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Examiner</Table.Th>
                <Table.Th>Comment</Table.Th>
                <Table.Th>Created</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {query.data.items.map((row) => (
                <Table.Tr key={row.id} data-testid="vcc-row">
                  <Table.Td>
                    <Radio
                      checked={selectedVCC === row.id}
                      onChange={() => setSelectedVCC(row.id)}
                      aria-label={`Select ${row.id}`}
                    />
                  </Table.Td>
                  <Table.Td>{row.id}</Table.Td>
                  <Table.Td>{row.caseNumber}</Table.Td>
                  <Table.Td>
                    <BIQBadge color={statusColor(row.status)}>{row.status}</BIQBadge>
                  </Table.Td>
                  <Table.Td>{row.examiner}</Table.Td>
                  <Table.Td>{row.comment}</Table.Td>
                  <Table.Td>{new Date(row.createdAt).toLocaleString()}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}

        <Tabs defaultValue="csa">
          <Tabs.List>
            <Tabs.Tab value="csa" onClick={() => setReportType('CSA')}>
              CSA Report
            </Tabs.Tab>
            <Tabs.Tab value="qa" onClick={() => setReportType('QA')}>
              QA Report
            </Tabs.Tab>
            <Tabs.Tab value="plr" onClick={() => setReportType('PLR')}>
              PLR Report
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="csa" pt="md">
            <Text>
              CSA report: case + verification status + examiner sign-off. Export to PDF + archive
              (placeholder).
            </Text>
          </Tabs.Panel>
          <Tabs.Panel value="qa" pt="md">
            <Text>QA report: reviewer audit trail + result. Export to Excel (placeholder).</Text>
          </Tabs.Panel>
          <Tabs.Panel value="plr" pt="md">
            <Text>PLR — Possible Link Report. Shows matched items + scores + recommendations.</Text>
          </Tabs.Panel>
        </Tabs>

        <Text size="xs" c="dimmed">
          Current report type: {reportType}
        </Text>
      </Stack>

      <BIQModal
        opened={verbiageOpen}
        onClose={() => setVerbiageOpen(false)}
        title="Standard Verbiage"
        size="md"
        footer={
          <BIQButton variant="default" onClick={() => setVerbiageOpen(false)}>
            Close
          </BIQButton>
        }
      >
        <Stack gap="xs">
          <Text size="sm">Click a phrase to insert it into the comment field:</Text>
          {STANDARD_VERBIAGE.map((v, i) => (
            <BIQButton
              key={i}
              variant="subtle"
              size="xs"
              onClick={() => {
                setComment((c) => (c ? `${c}\n${v}` : v));
                setVerbiageOpen(false);
              }}
            >
              {v}
            </BIQButton>
          ))}
        </Stack>
      </BIQModal>

      <BIQModal
        opened={notifyOpen}
        onClose={() => setNotifyOpen(false)}
        title="Save VCC + Notify"
        size="md"
        footer={
          <Group gap="sm">
            <BIQButton variant="default" onClick={() => setNotifyOpen(false)}>
              Cancel
            </BIQButton>
            <BIQButton variant="filled" onClick={handleSave} loading={saveMutation.isPending}>
              Save + Notify
            </BIQButton>
          </Group>
        }
      >
        <Stack gap="sm">
          <Text size="sm">Final comment for VCC {selectedVCC}:</Text>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
            minRows={4}
            placeholder="Final examiner comment (4000 chars max)"
            maxLength={4000}
          />
          <Checkbox
            label="Notify all assigned examiners + Evidence IQ team"
            checked={notifyExaminers}
            onChange={(e) => setNotifyExaminers(e.currentTarget.checked)}
          />
        </Stack>
      </BIQModal>
    </Container>
  );
}
