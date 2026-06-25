import { useState } from 'react';
import { Container, Stack, Title, Text, Group, SimpleGrid, Slider } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { BIQCanvas, type CanvasShape } from '@/components/canvas';
import { BIQButton } from '@/components/primitives';
import { EmptyState } from '@/components/feedback';
import { messageBox } from '@/components/modal';

export default function ImageComparePage() {
  const [params] = useSearchParams();
  const caseNumber = params.get('caseNumber') ?? '';
  const [opacity, setOpacity] = useState(50);

  if (!caseNumber) {
    return (
      <Container size="xl" py="xl">
        <EmptyState message="No case number" hint="Provide ?caseNumber=X." />
      </Container>
    );
  }

  // POC shapes — would come from backend in real integration
  const leftShapes: CanvasShape[] = [
    { type: 'rect', x: 50, y: 50, w: 80, h: 80, color: '#22c55e' },
    { type: 'text', x: 50, y: 40, text: 'Left specimen' },
  ];
  const rightShapes: CanvasShape[] = [
    { type: 'rect', x: 50, y: 50, w: 80, h: 80, color: '#3b82f6' },
    { type: 'text', x: 50, y: 40, text: 'Right specimen' },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Image Compare — {caseNumber}
        </Title>
        <Text size="sm" c="dimmed">
          Side-by-side specimen comparison. Real interactive tools (overlay, swipe, point-tag) ship
          with backend image integration. Opacity slider demos the canvas wiring.
        </Text>

        <Group>
          <Text size="sm">Overlay opacity:</Text>
          <Slider
            value={opacity}
            onChange={setOpacity}
            min={0}
            max={100}
            style={{ flex: 1, maxWidth: 240 }}
            data-testid="opacity-slider"
          />
          <Text size="sm" c="dimmed">
            {opacity}%
          </Text>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <BIQCanvas
            width={400}
            height={300}
            shapes={leftShapes}
            ariaLabel="Left specimen canvas"
          />
          <BIQCanvas
            width={400}
            height={300}
            shapes={rightShapes}
            ariaLabel="Right specimen canvas"
          />
        </SimpleGrid>

        <Group justify="flex-end">
          <BIQButton
            variant="default"
            onClick={() => void messageBox.info('Save annotation placeholder.')}
          >
            Save annotations
          </BIQButton>
        </Group>
      </Stack>
    </Container>
  );
}
