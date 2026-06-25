import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BIQMap, type MapMarker } from '../BIQMap';

// Mock react-leaflet — its MapContainer relies on DOM APIs not present
// in happy-dom (createRange/measureText etc). Render-only test ensures
// we wired up the wrapper / aria role without booting Leaflet itself.
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="mock-tile-layer" />,
  Marker: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="mock-marker">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-popup">{children}</div>
  ),
}));

// Stub leaflet asset imports (PNG + CSS) so happy-dom doesn't fail on transform
vi.mock('leaflet', () => ({
  default: {
    Icon: {
      Default: {
        prototype: {},
        mergeOptions: vi.fn(),
      },
    },
  },
}));
vi.mock('leaflet/dist/images/marker-icon.png', () => ({ default: 'mock-icon.png' }));
vi.mock('leaflet/dist/images/marker-icon-2x.png', () => ({ default: 'mock-icon-2x.png' }));
vi.mock('leaflet/dist/images/marker-shadow.png', () => ({ default: 'mock-shadow.png' }));
vi.mock('leaflet/dist/leaflet.css', () => ({}));

describe('BIQMap', () => {
  it('renders region role with aria-label', () => {
    render(<BIQMap markers={[]} ariaLabel="Test map" />);
    expect(screen.getByRole('region', { name: /test map/i })).toBeInTheDocument();
  });

  it('renders one marker per data row after lazy leaflet init', async () => {
    const markers: MapMarker[] = [
      { id: 'a', lat: 1, lng: 2 },
      { id: 'b', lat: 3, lng: 4 },
      { id: 'c', lat: 5, lng: 6 },
    ];
    render(<BIQMap markers={markers} />);
    await waitFor(() => {
      expect(screen.getAllByTestId('mock-marker')).toHaveLength(3);
    });
  });

  it('renders popup content when provided', async () => {
    const markers: MapMarker[] = [{ id: 'a', lat: 1, lng: 2, popup: <span>Hello popup</span> }];
    render(<BIQMap markers={markers} />);
    await waitFor(() => {
      expect(screen.getByText('Hello popup')).toBeInTheDocument();
    });
  });

  it('renders region wrapper without markers (no lazy init needed)', () => {
    render(<BIQMap markers={[]} />);
    expect(screen.getByTestId('biq-map')).toBeInTheDocument();
  });
});
