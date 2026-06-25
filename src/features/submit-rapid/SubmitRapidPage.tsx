import { Container, Stack, Title, Group, Radio, Text } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BIQButton, BIQInput, BIQSelect, BIQTextarea } from '@/components/primitives';
import { messageBox } from '@/components/modal';
import {
  WEAPON_TYPES,
  defaultRapidBallisticsValues,
  rapidBallisticsSchema,
  type RapidBallisticsInput,
} from './schema';
import { PhotoUpload } from './PhotoUpload';
import { useSubmitRapid } from './useSubmitRapid';

export default function SubmitRapidPage() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RapidBallisticsInput>({
    resolver: zodResolver(rapidBallisticsSchema),
    defaultValues: defaultRapidBallisticsValues,
    mode: 'onSubmit',
  });
  const submitMutation = useSubmitRapid();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await submitMutation.mutateAsync(values);
      await messageBox.success(
        `Submission accepted (ID: ${result.submissionId}, ${result.photoCount} photo(s)).`
      );
      reset(defaultRapidBallisticsValues);
    } catch (err) {
      await messageBox.error(err instanceof Error ? err.message : 'Submission failed.');
    }
  });

  return (
    <Container size="md" py="xl">
      <form onSubmit={onSubmit} aria-label="Rapid ballistics submission" noValidate>
        <Stack gap="md">
          <Title order={3} c="biq.7">
            Submit Rapid Ballistics
          </Title>
          <Text size="sm" c="dimmed">
            Submit a rapid ballistics request. Photos and additional details speed up examiner
            response.
          </Text>

          <BIQInput
            label="Case number"
            required
            maxLength={50}
            placeholder="e.g. CASE-2026-001"
            {...register('caseNumber')}
            error={errors.caseNumber?.message}
          />

          <BIQInput
            label="Location"
            maxLength={200}
            placeholder="City, state (optional)"
            {...register('location')}
            error={errors.location?.message}
          />

          <Controller
            control={control}
            name="weaponType"
            render={({ field }) => (
              <BIQSelect
                label="Weapon type"
                required
                data={[...WEAPON_TYPES]}
                value={field.value}
                onChange={(v) => field.onChange(v ?? 'Handgun')}
                error={errors.weaponType?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Radio.Group
                label="Request priority"
                required
                value={field.value}
                onChange={(v) => field.onChange(v)}
              >
                <Group gap="md" mt="xs">
                  <Radio value="routine" label="Routine" />
                  <Radio value="urgent" label="Urgent" />
                </Group>
              </Radio.Group>
            )}
          />

          <BIQTextarea
            label="Comment"
            required
            maxLength={4000}
            minRows={4}
            placeholder="Notes for the examiner (required, max 4000 chars)"
            {...register('comment')}
            error={errors.comment?.message}
          />

          <Controller
            control={control}
            name="photos"
            render={({ field }) => (
              <PhotoUpload
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
              onClick={() => reset(defaultRapidBallisticsValues)}
            >
              Clear
            </BIQButton>
            <BIQButton type="submit" loading={isSubmitting} variant="filled">
              Submit
            </BIQButton>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
