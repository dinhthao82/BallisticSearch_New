import { useEffect, useMemo } from 'react';
import { FileInput, SimpleGrid, Text, Stack, Group, ActionIcon, Image, Card } from '@mantine/core';
import { IconX, IconPhoto } from '@tabler/icons-react';
import { ACCEPTED_PHOTO_MIME, MAX_PHOTO_COUNT, MAX_PHOTO_SIZE_BYTES } from './schema';

interface PhotoUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  error?: string;
}

export function PhotoUpload({ value, onChange, error }: PhotoUploadProps) {
  // Object URLs for previews — recomputed when file list changes
  const previewUrls = useMemo(() => value.map((file) => URL.createObjectURL(file)), [value]);

  // Revoke URLs on unmount / when previewUrls changes (avoid memory leak)
  useEffect(() => {
    return () => {
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previewUrls]);

  const limitMessage = useMemo(
    () =>
      `Max ${MAX_PHOTO_COUNT} photos, ${MAX_PHOTO_SIZE_BYTES / 1024 / 1024} MB each (JPEG / PNG).`,
    []
  );

  const handleAdd = (incoming: File[]) => {
    if (incoming.length === 0) return;
    const next = [...value, ...incoming].slice(0, MAX_PHOTO_COUNT);
    onChange(next);
  };

  const handleRemove = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <Stack gap="xs">
      <FileInput
        label="Photos"
        placeholder="Add photos…"
        multiple
        accept={ACCEPTED_PHOTO_MIME.join(',')}
        leftSection={<IconPhoto size={16} />}
        value={[]}
        onChange={handleAdd}
        disabled={value.length >= MAX_PHOTO_COUNT}
        description={limitMessage}
        error={error}
        clearable
      />
      {value.length > 0 && (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
          {value.map((file, index) => {
            const url = previewUrls[index];
            return (
              <Card
                key={`${file.name}-${index}`}
                withBorder
                padding="xs"
                radius="sm"
                data-testid="photo-preview-card"
              >
                <Card.Section>
                  {url ? (
                    <Image src={url} alt={file.name} h={96} fit="cover" />
                  ) : (
                    <Stack align="center" justify="center" h={96}>
                      <IconPhoto size={32} />
                    </Stack>
                  )}
                </Card.Section>
                <Group gap="xs" mt="xs" justify="space-between" wrap="nowrap">
                  <Text size="xs" truncate>
                    {file.name}
                  </Text>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={() => handleRemove(index)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                </Group>
                <Text size="xs" c="dimmed">
                  {(file.size / 1024).toFixed(1)} KB
                </Text>
              </Card>
            );
          })}
        </SimpleGrid>
      )}
    </Stack>
  );
}
