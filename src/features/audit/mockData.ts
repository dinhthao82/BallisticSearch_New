import type { AuditTransactionItem, LoginAuditItem, InfoAuditItem } from './types';

const USERS = ['jdoe', 'asmith', 'rjones', 'mkim'];
const ACTIONS = ['create', 'update', 'delete', 'export', 'view'];
const RESOURCES = ['user', 'agency', 'contract', 'search', 'report'];

export const mockTransactionData: AuditTransactionItem[] = Array.from({ length: 60 }, (_, i) => ({
  id: `T-${(10000 + i).toString()}`,
  user: USERS[i % USERS.length] ?? 'jdoe',
  action: ACTIONS[i % ACTIONS.length] ?? 'view',
  resource: RESOURCES[i % RESOURCES.length] ?? 'user',
  occurredAt: `2026-${String((i % 6) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T${String(i % 24).padStart(2, '0')}:00:00Z`,
  ipAddress: `10.0.${i % 5}.${i % 255}`,
}));

export const mockLoginAuditData: LoginAuditItem[] = Array.from({ length: 40 }, (_, i) => ({
  id: `L-${(20000 + i).toString()}`,
  user: USERS[i % USERS.length] ?? 'jdoe',
  occurredAt: `2026-${String((i % 6) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T${String(i % 24).padStart(2, '0')}:15:00Z`,
  ipAddress: `192.168.0.${i % 255}`,
  result: i % 4 === 0 ? 'Failed' : 'Success',
  reason: i % 4 === 0 ? 'Invalid password' : undefined,
}));

export const mockInfoAuditData: InfoAuditItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: `I-${(30000 + i).toString()}`,
  user: USERS[i % USERS.length] ?? 'jdoe',
  action: ACTIONS[i % ACTIONS.length] ?? 'view',
  details: `Detail entry ${i}: information event for audit log`,
  occurredAt: `2026-${String((i % 6) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T${String(i % 24).padStart(2, '0')}:30:00Z`,
}));
