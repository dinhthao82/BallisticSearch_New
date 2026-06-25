import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UploadBulletPage from '../UploadBulletPage';
import { mantineTheme } from '@/theme/mantineTheme';

function ui(node: React.ReactNode) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return (
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>{node}</QueryClientProvider>
    </MantineProvider>
  );
}

describe('UploadBulletPage', () => {
  it('renders title and metadata fields', () => {
    render(ui(<UploadBulletPage />));
    expect(screen.getByText('Upload Bullet')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /case number/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /bullet id/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /notes/i })).toBeInTheDocument();
  });

  it('renders photos input with description', () => {
    render(ui(<UploadBulletPage />));
    expect(screen.getByText(/Max 8 photos/i)).toBeInTheDocument();
  });

  it('shows required-field errors on empty submit', async () => {
    render(ui(<UploadBulletPage />));
    const form = screen.getByRole('form', { name: /upload bullet form/i });
    fireEvent.submit(form);
    expect(await screen.findByText(/case number is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/bullet id is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/at least one photo is required/i)).toBeInTheDocument();
  });

  it('Clear resets dirty caseNumber input', () => {
    render(ui(<UploadBulletPage />));
    const input = screen.getByRole('textbox', { name: /case number/i }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'CASE-1' } });
    expect(input.value).toBe('CASE-1');
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(input.value).toBe('');
  });
});
