import { Container, Stack, Title, Text } from '@mantine/core';

export default function CaseNumberPage() {
  return (
    <Container size="sm" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Audit Inquiry
        </Title>
        <Text>An audit-trail entry will be recorded for this access.</Text>
        <Text>Please provide the requested information:</Text>
      </Stack>
    </Container>
  );
}
