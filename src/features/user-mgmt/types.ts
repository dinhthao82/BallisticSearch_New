import type { UserRole } from './schemas';

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface UsersResponse {
  items: UserRecord[];
  total: number;
}
