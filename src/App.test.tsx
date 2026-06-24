import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import LoginPage from '@/features/login/LoginPage';
import { mantineTheme } from '@/theme/mantineTheme';

describe('LoginPage', () => {
  it('renders username and password inputs', () => {
    render(
      <MantineProvider theme={mantineTheme}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </MantineProvider>
    );
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
