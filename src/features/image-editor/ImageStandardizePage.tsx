import { useState } from 'react';
import { Container, Stack, Title, Text, Group, Switch } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { BIQCanvas, type CanvasShape } from '@/components/canvas';
import { BIQButton } from '@/components/primitives';
import { EmptyState } from '@/components/feedback';
import { messageBox } from '@/components/modal';

export default function ImageStandardizePage() {
  const [params] = useSearchParams();
  const caseNumber = params.get('caseNumber') ?? '';
  const [autoContrast, setAutoContrast] = useState(true);
  const [autoCrop, setAutoCrop] = useState(false);
  const [denoise, setDenoise] = useState(false);

  if (!caseNumber) {
    return (
      <Container size="xl" py="xl">
        <EmptyState message="No case number" hint="Provide ?caseNumber=X." />
      </Container>
    );
  }

  const shapes: CanvasShape[] = [
    {
      type: 'rect',
      x: 50,
      y: 50,
      w: 300,
      h: 200,
      color: autoContrast ? '#22c55e' : '#868e96',
    },
    {
      type: 'text',
      x: 50,
      y: 40,
      text: `Standardized preview (contrast ${autoContrast ? 'ON' : 'off'}, crop ${autoCrop ? 'ON' : 'off'}, denoise ${denoise ? 'ON' : 'off'})`,
    },
  ];

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Image Standardize — {caseNumber}
        </Title>
        <Text size="sm" c="dimmed">
          Apply standardization pipeline (contrast / crop / denoise) before submitting to the search
          index. POC preview is shape-based; real pipeline runs server-side.
        </Text>

        <Group>
          <Switch
            label="Auto-contrast"
            checked={autoContrast}
            onChange={(e) => setAutoContrast(e.currentTarget.checked)}
          />
          <Switch
            label="Auto-crop"
            checked={autoCrop}
            onChange={(e) => setAutoCrop(e.currentTarget.checked)}
          />
          <Switch
            label="Denoise"
            checked={denoise}
            onChange={(e) => setDenoise(e.currentTarget.checked)}
          />
        </Group>

        <BIQCanvas
          width={400}
          height={280}
          shapes={shapes}
          ariaLabel="Standardize preview canvas"
        />

        <Group justify="flex-end">
          <BIQButton
            variant="filled"
            onClick={() => void messageBox.success('Standardization queued.')}
          >
            Submit standardization job
          </BIQButton>
        </Group>
      </Stack>
    </Container>
  );
}
