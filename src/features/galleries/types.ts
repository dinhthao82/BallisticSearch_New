export interface GalleryItem {
  id: string;
  caseNumber: string;
  galleryName: string;
  itemCount: number;
  thumbnailUrl?: string;
  status: 'Active' | 'Archived' | 'Pending';
  updatedAt: string;
}

export interface DetectionDetail {
  id: string;
  caseNumber: string;
  detectionType: string;
  score: number;
  detectedAt: string;
  notes: string;
}

export interface CSAUploadedItem {
  id: string;
  caseNumber: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'Pending' | 'Processed' | 'Failed';
  itemCount: number;
}

export interface PotentialLinkDetail {
  potentialId: string;
  caseNumber: string;
  matchScore: number;
  matchedItems: { id: string; thumbnailUrl?: string; label: string }[];
  notes: string;
}
