import type { UserRecord } from './types';
import type { UserRole } from './schemas';

const ROLES: UserRole[] = ['Admin', 'Agency', 'Regular', 'Examiner', 'ExaminerManager'];

export const mockUserData: UserRecord[] = Array.from({ length: 40 }, (_, i) => ({
  id: `U-${(1000 + i).toString()}`,
  username: `user${i}`,
  email: `user${i}@example.com`,
  firstName: `First${i}`,
  lastName: `Last${i}`,
  role: ROLES[i % ROLES.length] ?? 'Regular',
  active: i % 5 !== 0,
  createdAt: `2026-${String((i % 6) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T09:00:00Z`,
}));
