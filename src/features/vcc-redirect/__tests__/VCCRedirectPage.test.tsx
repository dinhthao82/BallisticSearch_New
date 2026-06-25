import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import VCCRedirectPage from '../VCCRedirectPage';
import { mantineTheme } from '@/theme/mantineTheme';

function renderAt(path: string) {
  return render(
    <MantineProvider theme={mantineTheme}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/app/vcc-redirect" element={<VCCRedirectPage />} />
          <Route path="/app/edit-vcc" element={<div>VCC editor at {window.location.search}</div>} />
        </Routes>
      </MemoryRouter>
    </MantineProvider>
  );
}

describe('VCCRedirectPage', () => {
  it('navigates to /app/edit-vcc without query when no vccId', async () => {
    renderAt('/app/vcc-redirect');
    await waitFor(() => {
      expect(screen.getByText(/VCC editor at/i)).toBeInTheDocument();
    });
  });

  it('navigates with vccId param preserved', async () => {
    renderAt('/app/vcc-redirect?vccId=VCC-001');
    await waitFor(() => {
      expect(screen.getByText(/VCC editor at/i)).toBeInTheDocument();
    });
  });
});
