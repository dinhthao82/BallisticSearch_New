import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  popup?: React.ReactNode;
}

export interface BIQMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: number | string;
  ariaLabel?: string;
}

function avg(arr: number[]) {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Leaflet's default marker icon URLs break under Vite's bundler — wire
// them up explicitly so markers render correctly in production builds.
// Done lazily at runtime so vitest doesn't have to handle the PNG imports.
let iconsConfigured = false;
async function configureLeafletIcons() {
  if (iconsConfigured) return;
  iconsConfigured = true;
  const [L, iconUrl, iconRetinaUrl, shadowUrl] = await Promise.all([
    import('leaflet'),
    import('leaflet/dist/images/marker-icon.png'),
    import('leaflet/dist/images/marker-icon-2x.png'),
    import('leaflet/dist/images/marker-shadow.png'),
  ]);
  await import('leaflet/dist/leaflet.css');
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl.default,
    iconUrl: iconUrl.default,
    shadowUrl: shadowUrl.default,
  });
}

export function BIQMap({
  markers,
  center,
  zoom = 4,
  height = 480,
  ariaLabel = 'Map',
}: BIQMapProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    configureLeafletIcons()
      .then(() => setReady(true))
      .catch(() => setReady(true));
  }, []);

  const fallbackCenter = useMemo<[number, number]>(() => {
    if (markers.length === 0) return [39.8283, -98.5795]; // continental US centroid
    return [avg(markers.map((m) => m.lat)), avg(markers.map((m) => m.lng))];
  }, [markers]);

  return (
    <div role="region" aria-label={ariaLabel} style={{ height }} data-testid="biq-map">
      {ready && (
        <MapContainer
          center={center ?? fallbackCenter}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lng]}>
              {m.popup ? <Popup>{m.popup}</Popup> : null}
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}

export default BIQMap;
