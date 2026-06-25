import { Container, Stack, Title, Text, SimpleGrid, Card, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import {
  IconSearch,
  IconUpload,
  IconMail,
  IconReport,
  IconMap,
  IconClipboardList,
} from '@tabler/icons-react';
import { useUserStore } from '@/store/userStore';

interface QuickAction {
  to: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number | string }>;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    to: '/app/search-apl',
    label: 'Search APL',
    description: 'Search APL process records',
    icon: IconSearch,
  },
  {
    to: '/app/search-event',
    label: 'Search Events',
    description: 'Multi-criteria forensic event search w/ Compare + Export',
    icon: IconSearch,
  },
  {
    to: '/app/search-csa',
    label: 'Search CSA Process',
    description: 'Browse CSA process records by status / assignee',
    icon: IconSearch,
  },
  {
    to: '/app/search-qa',
    label: 'Search QA Reports',
    description: 'Browse QA reports by result / reviewer',
    icon: IconSearch,
  },
  {
    to: '/app/submit-rapid',
    label: 'Submit Rapid',
    description: 'Submit a rapid ballistics request',
    icon: IconUpload,
  },
  {
    to: '/app/upload-bullet',
    label: 'Upload Bullet',
    description: 'Upload photos + metadata for a bullet specimen',
    icon: IconUpload,
  },
  {
    to: '/app/compose-email',
    label: 'Compose Email',
    description: 'Send a notification email',
    icon: IconMail,
  },
  {
    to: '/app/auditing-contract',
    label: 'Auditing Contracts',
    description: 'Browse contracts under audit',
    icon: IconClipboardList,
  },
  {
    to: '/app/case-number',
    label: 'Case Number Inquiry',
    description: 'Open an audit-recorded case inquiry',
    icon: IconReport,
  },
  {
    to: '/app/map-of-agencies',
    label: 'Map of Agencies',
    description: 'Geographic view of agency locations',
    icon: IconMap,
  },
  {
    to: '/app/map-of-galleries',
    label: 'Map of Galleries',
    description: 'Geographic view of gallery locations',
    icon: IconMap,
  },
];

export default function HomePage() {
  const user = useUserStore((s) => s.user);

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Stack gap="xs">
          <Title order={3} c="biq.7">
            Welcome{user ? `, ${user.username}` : ''}
          </Title>
          <Text size="sm" c="dimmed">
            Pick a tool below to get started.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {QUICK_ACTIONS.map((action) => (
            <Card
              key={action.to}
              component={Link}
              to={action.to}
              withBorder
              padding="md"
              radius="md"
              data-testid="home-quick-action"
              style={{ textDecoration: 'none' }}
            >
              <Group gap="sm" align="flex-start">
                <action.icon size={28} />
                <Stack gap={2}>
                  <Text fw={600}>{action.label}</Text>
                  <Text size="sm" c="dimmed">
                    {action.description}
                  </Text>
                </Stack>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
