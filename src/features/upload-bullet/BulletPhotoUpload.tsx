import { useEffect, useMemo } from 'react';
import { FileInput, SimpleGrid, Text, Stack, Group, ActionIcon, Image, Card } from '@mantine/core';
import { IconX, IconPhoto } from '@tabler/icons-react';
import { ACCEPTED_PHOTO_MIME, MAX_PHOTO_COUNT, MAX_PHOTO_SIZE_BYTES } from './schema';

interface BulletPhotoUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  error?: string;
}

export function BulletPhotoUpload({ value, onChange, error }: BulletPhotoUploadProps) {
  const previewUrls = useMemo(() => value.map((f) => URL.createObjectURL(f)), [value]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previewUrls]);

  const limitMessage = `Max ${MAX_PHOTO_COUNT} photos, ${MAX_PHOTO_SIZE_BYTES / 1024 / 1024} MB each (JPEG / PNG / TIFF).`;

  const handleAdd = (incoming: File[]) => {
    if (incoming.length === 0) return;
    onChange([...value, ...incoming].slice(0, MAX_PHOTO_COUNT));
  };

  const handleRemove = (idx: number) => onChange(value.filter((_, i) => i !== idx));

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
          {value.map((file, idx) => {
            const url = previewUrls[idx];
            return (
              <Card
                key={`${file.name}-${idx}`}
                withBorder
                padding="xs"
                radius="sm"
                data-testid="bullet-photo-card"
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
                    onClick={() => handleRemove(idx)}
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
