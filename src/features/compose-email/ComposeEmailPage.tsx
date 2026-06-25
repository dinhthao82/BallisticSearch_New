import { Container, Stack, Title, Group, Text } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BIQButton, BIQInput, BIQTextarea } from '@/components/primitives';
import { messageBox } from '@/components/modal';
import { composeEmailSchema, defaultComposeEmailValues, type ComposeEmailInput } from './schema';
import { useSendEmail } from './useSendEmail';

export default function ComposeEmailPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ComposeEmailInput>({
    resolver: zodResolver(composeEmailSchema),
    defaultValues: defaultComposeEmailValues,
    mode: 'onSubmit',
  });
  const sendMutation = useSendEmail();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await sendMutation.mutateAsync(values);
      await messageBox.success(
        `Email queued (ID: ${result.messageId}, ${result.recipients} recipients).`
      );
      reset(defaultComposeEmailValues);
    } catch (err) {
      await messageBox.error(err instanceof Error ? err.message : 'Failed to send email.');
    }
  });

  return (
    <Container size="md" py="xl">
      <form onSubmit={onSubmit} aria-label="Compose email form" noValidate>
        <Stack gap="md">
          <Title order={3} c="biq.7">
            Compose Email
          </Title>
          <Text size="sm" c="dimmed">
            Send a notification email. Comma- or space-separated recipients.
          </Text>

          <BIQInput
            label="To"
            required
            placeholder="alice@example.com, bob@example.com"
            {...register('to')}
            error={errors.to?.message}
          />

          <BIQInput
            label="Cc"
            placeholder="optional@example.com"
            {...register('cc')}
            error={errors.cc?.message}
          />

          <BIQInput
            label="Subject"
            required
            maxLength={200}
            {...register('subject')}
            error={errors.subject?.message}
          />

          <BIQTextarea
            label="Body"
            required
            maxLength={10000}
            minRows={6}
            {...register('body')}
            error={errors.body?.message}
          />

          <Group justify="flex-end" gap="sm">
            <BIQButton
              type="button"
              variant="default"
              onClick={() => reset(defaultComposeEmailValues)}
            >
              Clear
            </BIQButton>
            <BIQButton type="submit" loading={isSubmitting} variant="filled">
              Send
            </BIQButton>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
