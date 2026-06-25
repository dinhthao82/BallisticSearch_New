import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Text } from '@mantine/core';

export default function VCCRedirectPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const vccId = params.get('vccId') ?? '';
    const target = vccId ? `/app/edit-vcc?vccId=${encodeURIComponent(vccId)}` : '/app/edit-vcc';
    navigate(target, { replace: true });
  }, [navigate, params]);

  return (
    <Container size="sm" py="xl">
      <Text size="sm" c="dimmed">
        Redirecting to VCC editor…
      </Text>
    </Container>
  );
}
