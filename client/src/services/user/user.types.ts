export type Role = 'ADMIN' | 'USER';

export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
};
