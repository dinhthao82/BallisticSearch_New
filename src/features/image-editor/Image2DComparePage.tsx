import { useState } from 'react';
import { Container, Stack, Title, Text, Group, NumberInput } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { BIQCanvas, type CanvasShape } from '@/components/canvas';
import { BIQButton } from '@/components/primitives';
import { EmptyState } from '@/components/feedback';

export default function Image2DComparePage() {
  const [params] = useSearchParams();
  const caseNumber = params.get('caseNumber') ?? '';
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!caseNumber) {
    return (
      <Container size="xl" py="xl">
        <EmptyState message="No case number" hint="Provide ?caseNumber=X." />
      </Container>
    );
  }

  const shapes: CanvasShape[] = [
    { type: 'rect', x: 100, y: 100, w: 200, h: 150, color: '#435d7d' },
    { type: 'circle', x: 200, y: 175, r: 30, color: '#f59e0b' },
    { type: 'text', x: 100, y: 90, text: `Zoom ${zoom}% / Rot ${rotation}°` },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          2D Compare Tool — {caseNumber}
        </Title>
        <Text size="sm" c="dimmed">
          Apply zoom / rotation transforms before alignment. Full 2D registration UI ships with
          backend integration.
        </Text>

        <Group>
          <NumberInput
            label="Zoom %"
            min={10}
            max={500}
            step={10}
            value={zoom}
            onChange={(v) => setZoom(typeof v === 'number' ? v : Number(v) || 100)}
          />
          <NumberInput
            label="Rotation °"
            min={-180}
            max={180}
            step={5}
            value={rotation}
            onChange={(v) => setRotation(typeof v === 'number' ? v : Number(v) || 0)}
          />
          <BIQButton
            variant="default"
            size="sm"
            mt={24}
            onClick={() => {
              setZoom(100);
              setRotation(0);
            }}
          >
            Reset
          </BIQButton>
        </Group>

        <BIQCanvas width={500} height={350} shapes={shapes} ariaLabel="2D compare canvas" />
      </Stack>
    </Container>
  );
}
