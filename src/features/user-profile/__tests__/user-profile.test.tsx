import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import UserProfilesPage from '../UserProfilesPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { passwordChangeSchema, defaultPasswordValues, mfaSetupSchema } from '../schema';

function ui(node: React.ReactNode) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>
        <MemoryRouter>{node}</MemoryRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}

describe('password schemas', () => {
  it('rejects mismatched passwords', () => {
    expect(
      passwordChangeSchema.safeParse({
        ...defaultPasswordValues,
        currentPassword: 'x',
        newPassword: 'StrongPwd1!',
        confirmPassword: 'WrongPwd1!',
      }).success
    ).toBe(false);
  });

  it('accepts matched strong password', () => {
    expect(
      passwordChangeSchema.safeParse({
        currentPassword: 'x',
        newPassword: 'StrongPwd1!Abcd',
        confirmPassword: 'StrongPwd1!Abcd',
      }).success
    ).toBe(true);
  });

  it('rejects weak password (no special char)', () => {
    expect(
      passwordChangeSchema.safeParse({
        currentPassword: 'x',
        newPassword: 'StrongPwd123',
        confirmPassword: 'StrongPwd123',
      }).success
    ).toBe(false);
  });

  it('mfaSetupSchema rejects non-6-digit code', () => {
    expect(mfaSetupSchema.safeParse({ otpCode: '12345' }).success).toBe(false);
    expect(mfaSetupSchema.safeParse({ otpCode: '12345A' }).success).toBe(false);
  });

  it('mfaSetupSchema accepts 6-digit code', () => {
    expect(mfaSetupSchema.safeParse({ otpCode: '123456' }).success).toBe(true);
  });
});

describe('UserProfilesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders 4 tabs', () => {
    ui(<UserProfilesPage />);
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /change password/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /password expired/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /mfa setup/i })).toBeInTheDocument();
  });

  it('Change password tab — submit empty shows errors', async () => {
    ui(<UserProfilesPage />);
    fireEvent.click(screen.getByRole('tab', { name: /change password/i }));
    fireEvent.submit(screen.getByRole('form', { name: /change password form/i }));
    expect(await screen.findByText(/current password is required/i)).toBeInTheDocument();
  });
});
