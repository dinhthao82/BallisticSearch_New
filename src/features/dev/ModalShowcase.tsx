import { useState } from 'react';
import { Stack, Title, Text, Group } from '@mantine/core';
import { BIQModal, confirm } from '@/components/modal';
import { BIQButton } from '@/components/primitives';

export default function ModalShowcase() {
  const [opened, setOpened] = useState(false);
  const [lastResult, setLastResult] = useState<string>('—');

  return (
    <Stack p="lg" gap="lg">
      <Title order={2}>Modal showcase (DEV only)</Title>
      <Text c="dimmed" size="sm">
        BIQModal + confirm() smoke surface — used to eyeball focus trap, ESC behavior, backdrop
        click suppression, and confirm() Promise resolution.
      </Text>

      <Group>
        <BIQButton onClick={() => setOpened(true)}>Open BIQModal</BIQButton>
        <BIQButton
          variant="default"
          onClick={() => {
            void confirm({
              title: 'Sign out?',
              message: 'Any unsaved filter selections will be lost.',
            }).then((ok) => setLastResult(`confirm() → ${ok}`));
          }}
        >
          Open confirm()
        </BIQButton>
        <BIQButton
          color="red"
          onClick={() => {
            void confirm({
              title: 'Delete record?',
              message: 'This action cannot be undone.',
              confirmLabel: 'Delete',
              cancelLabel: 'Keep',
              danger: true,
            }).then((ok) => setLastResult(`destructive confirm() → ${ok}`));
          }}
        >
          Open destructive confirm()
        </BIQButton>
      </Group>

      <Text size="sm">
        Last result: <strong>{lastResult}</strong>
      </Text>

      <BIQModal
        opened={opened}
        onClose={() => setOpened(false)}
        title="BIQModal example"
        footer={
          <>
            <BIQButton variant="default" onClick={() => setOpened(false)}>
              Cancel
            </BIQButton>
            <BIQButton onClick={() => setOpened(false)}>OK</BIQButton>
          </>
        }
      >
        <Text>
          Click outside the modal — nothing happens (closeOnClickOutside defaults to false). Press
          ESC to dismiss. Focus is trapped inside until close; focus returns to the trigger button
          after close.
        </Text>
      </BIQModal>
    </Stack>
  );
}
