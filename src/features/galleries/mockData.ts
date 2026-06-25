import type { GalleryItem, DetectionDetail, CSAUploadedItem, PotentialLinkDetail } from './types';

const STATUSES: GalleryItem['status'][] = ['Active', 'Archived', 'Pending'];

export const mockGalleries: GalleryItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: `G-${(2000 + i).toString()}`,
  caseNumber: `W${(126000 + i).toString()}`,
  galleryName: `Gallery ${i}`,
  itemCount: 10 + i * 3,
  status: STATUSES[i % STATUSES.length] ?? 'Active',
  updatedAt: `2026-06-${String((i % 20) + 1).padStart(2, '0')}T10:00:00Z`,
}));

export const mockDetectionDetails: Record<string, DetectionDetail> = Object.fromEntries(
  Array.from({ length: 10 }, (_, i) => [
    `DET-${(3000 + i).toString()}`,
    {
      id: `DET-${(3000 + i).toString()}`,
      caseNumber: `W${(127000 + i).toString()}`,
      detectionType: i % 2 === 0 ? 'Cartridge case' : 'Bullet',
      score: 60 + (i % 40),
      detectedAt: `2026-06-${String((i % 20) + 1).padStart(2, '0')}T09:00:00Z`,
      notes: `Detection notes ${i}`,
    },
  ])
);

export const mockCSAUploaded: CSAUploadedItem[] = Array.from({ length: 15 }, (_, i) => ({
  id: `CSAU-${(4000 + i).toString()}`,
  caseNumber: `W${(128000 + i).toString()}`,
  uploadedBy: ['jdoe', 'asmith'][i % 2] ?? 'jdoe',
  uploadedAt: `2026-06-${String((i % 20) + 1).padStart(2, '0')}T11:00:00Z`,
  status: (['Pending', 'Processed', 'Failed'] as const)[i % 3] ?? 'Pending',
  itemCount: 5 + i * 2,
}));

export const mockPotentialLink: Record<string, PotentialLinkDetail> = {
  'PL-001': {
    potentialId: 'PL-001',
    caseNumber: 'W129001',
    matchScore: 87.5,
    matchedItems: [
      { id: 'IT-1', label: 'Item 1' },
      { id: 'IT-2', label: 'Item 2' },
      { id: 'IT-3', label: 'Item 3' },
    ],
    notes: 'High-confidence match across 3 items.',
  },
};
