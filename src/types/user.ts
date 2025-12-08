export type UserRole = 'admin' | 'agent';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  active: boolean;
  createdAt: string;
}
