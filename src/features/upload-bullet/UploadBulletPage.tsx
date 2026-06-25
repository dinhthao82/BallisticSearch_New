import { Container, Stack, Title, Group, NumberInput, Text } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BIQButton, BIQInput, BIQSelect, BIQTextarea } from '@/components/primitives';
import { messageBox } from '@/components/modal';
import {
  CALIBERS,
  defaultUploadBulletValues,
  uploadBulletSchema,
  type UploadBulletInput,
} from './schema';
import { BulletPhotoUpload } from './BulletPhotoUpload';
import { useUploadBullet } from './useUploadBullet';

export default function UploadBulletPage() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UploadBulletInput>({
    resolver: zodResolver(uploadBulletSchema),
    defaultValues: defaultUploadBulletValues,
    mode: 'onSubmit',
  });
  const upload = useUploadBullet();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await upload.mutateAsync(values);
      await messageBox.success(
        `Bullet uploaded (ID: ${result.bulletRecordId}, ${result.photoCount} photo(s)).`
      );
      reset(defaultUploadBulletValues);
    } catch (err) {
      await messageBox.error(err instanceof Error ? err.message : 'Upload failed.');
    }
  });

  return (
    <Container size="md" py="xl">
      <form onSubmit={onSubmit} aria-label="Upload bullet form" noValidate>
        <Stack gap="md">
          <Title order={3} c="biq.7">
            Upload Bullet
          </Title>
          <Text size="sm" c="dimmed">
            Upload photographs and metadata for a fired bullet specimen.
          </Text>

          <BIQInput
            label="Case number"
            required
            maxLength={50}
            placeholder="CASE-2026-001"
            {...register('caseNumber')}
            error={errors.caseNumber?.message}
          />

          <BIQInput
            label="Bullet ID"
            required
            maxLength={80}
            placeholder="BULLET-001"
            {...register('bulletId')}
            error={errors.bulletId?.message}
          />

          <Controller
            control={control}
            name="caliber"
            render={({ field }) => (
              <BIQSelect
                label="Caliber"
                required
                data={[...CALIBERS]}
                value={field.value}
                onChange={(v) => field.onChange(v ?? '9mm')}
                error={errors.caliber?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="massGrains"
            render={({ field }) => (
              <NumberInput
                label="Mass (grains)"
                required
                min={0}
                max={2000}
                step={0.1}
                value={field.value}
                onChange={(v) => field.onChange(typeof v === 'number' ? v : Number(v) || 0)}
                error={errors.massGrains?.message}
              />
            )}
          />

          <BIQTextarea
            label="Notes"
            maxLength={2000}
            minRows={3}
            placeholder="Optional observations"
            {...register('notes')}
            error={errors.notes?.message}
          />

          <Controller
            control={control}
            name="photos"
            render={({ field }) => (
              <BulletPhotoUpload
                value={field.value}
                onChange={(files) => field.onChange(files)}
                error={
                  errors.photos?.message ??
                  (Array.isArray(errors.photos)
                    ? errors.photos.find((e) => e?.message)?.message
                    : undefined)
                }
              />
            )}
          />

          <Group justify="flex-end" gap="sm" mt="md">
            <BIQButton
              type="button"
              variant="default"
              onClick={() => reset(defaultUploadBulletValues)}
            >
              Clear
            </BIQButton>
            <BIQButton type="submit" loading={isSubmitting} variant="filled">
              Upload
            </BIQButton>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
