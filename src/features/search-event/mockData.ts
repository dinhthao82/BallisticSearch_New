import type { SearchEventItem } from './types';

const TYPES: SearchEventItem['type'][] = ['CC', 'BC', 'PL'];
const SITES = ['Site A', 'Site B', 'Site C', 'Site D'];
const USERS = ['jdoe', 'asmith', 'rjones', 'mkim'];

export const mockSearchEventData: SearchEventItem[] = Array.from({ length: 50 }, (_, i) => ({
  eventId: `EV-${(20000 + i).toString()}`,
  caseNumber: `W${(123000 + i).toString()}`,
  score: Math.round((50 + (i % 50)) * 100) / 100,
  site: SITES[i % SITES.length] ?? 'Site A',
  user: USERS[i % USERS.length] ?? 'jdoe',
  eventDate: `2026-${String((i % 6) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T${String(i % 24).padStart(2, '0')}:00:00Z`,
  type: TYPES[i % TYPES.length] ?? 'CC',
}));
