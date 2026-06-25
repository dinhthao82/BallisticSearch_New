import { Container, Stack, Title, Text, Group, Radio, Box } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BIQButton, BIQInput, BIQTextarea } from '@/components/primitives';
import { messageBox } from '@/components/modal';
import { caseNumberSchema, defaultCaseNumberValues, type CaseNumberInput } from './schema';
import { useCaseNumberSubmit } from './useCaseNumberSubmit';

export default function CaseNumberPage() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CaseNumberInput>({
    resolver: zodResolver(caseNumberSchema),
    defaultValues: defaultCaseNumberValues,
    mode: 'onSubmit',
  });
  const submitMutation = useCaseNumberSubmit();
  const requestorMode = watch('requestor.mode');

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await submitMutation.mutateAsync(values);
      await messageBox.success(`Audit recorded (ID: ${result.auditId}).`);
      reset(defaultCaseNumberValues);
    } catch (err) {
      await messageBox.error(err instanceof Error ? err.message : 'Submission failed.');
    }
  });

  return (
    <Container size="sm" py="xl">
      <form onSubmit={onSubmit} aria-label="Case number audit form" noValidate>
        <Stack gap="md">
          <Box ta="center">
            <Title order={3} c="biq.7">
              Audit Inquiry
            </Title>
            <Text size="sm" mt="xs">
              An audit-trail entry will be recorded for this access.
            </Text>
            <Text size="sm">Please provide the requested information:</Text>
          </Box>

          <Controller
            control={control}
            name="requestor.mode"
            render={({ field }) => (
              <Radio.Group
                label="Requestor"
                value={field.value}
                onChange={(v) => field.onChange(v)}
              >
                <Group gap="md" mt="xs">
                  <Radio value="current" label="Current user" />
                  <Radio value="other" label="Change requestor" />
                </Group>
              </Radio.Group>
            )}
          />

          {requestorMode === 'other' && (
            <BIQInput
              label="Requestor name"
              maxLength={100}
              {...register('requestor.name')}
              error={errors.requestor?.name?.message}
            />
          )}

          <BIQInput
            label="Case number"
            required
            maxLength={50}
            placeholder="e.g. CASE-2026-001"
            {...register('caseNumber')}
            error={errors.caseNumber?.message}
          />

          <BIQTextarea
            label="Purpose"
            required
            maxLength={255}
            minRows={3}
            placeholder="Reason for accessing this case (max 255 characters)"
            {...register('purpose')}
            error={errors.purpose?.message}
          />

          <Group justify="center" gap="sm" mt="md">
            <BIQButton type="submit" loading={isSubmitting} variant="filled">
              Continue
            </BIQButton>
            <BIQButton
              type="button"
              variant="default"
              onClick={() => reset(defaultCaseNumberValues)}
            >
              Clear
            </BIQButton>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
