import { useState } from 'react';
import { Stack, Group, Text, Radio } from '@mantine/core';
import { BIQModal, messageBox } from '@/components/modal';
import { BIQButton } from '@/components/primitives';
import { api } from '@/api/client';

type ExportFormat = 'excel' | 'pdf';

interface ExportDialogProps {
  opened: boolean;
  ids: string[];
  onClose: () => void;
}

export function ExportDialog({ opened, ids, onClose }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('excel');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await api
        .post('search-events/export', { json: { ids, format } })
        .json<{ jobId: string; format: ExportFormat; count: number }>();
      await messageBox.success(
        `Export job ${result.jobId} queued — ${result.count} record(s) as ${result.format.toUpperCase()}.`
      );
      onClose();
    } catch (err) {
      await messageBox.error(err instanceof Error ? err.message : 'Export failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BIQModal
      opened={opened}
      onClose={onClose}
      title="Export search events"
      size="md"
      footer={
        <Group justify="flex-end">
          <BIQButton variant="default" onClick={onClose} disabled={submitting}>
            Cancel
          </BIQButton>
          <BIQButton
            variant="filled"
            onClick={handleSubmit}
            loading={submitting}
            disabled={ids.length === 0}
          >
            Submit export
          </BIQButton>
        </Group>
      }
    >
      <Stack gap="sm">
        <Text size="sm">
          Exporting {ids.length} record{ids.length === 1 ? '' : 's'}. Pick a format:
        </Text>
        <Radio.Group value={format} onChange={(v) => setFormat(v as ExportFormat)}>
          <Group gap="md" mt="xs">
            <Radio value="excel" label="Excel (.xlsx)" />
            <Radio value="pdf" label="PDF" />
          </Group>
        </Radio.Group>
      </Stack>
    </BIQModal>
  );
}
