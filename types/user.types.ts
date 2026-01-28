export enum UserRole {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  QA = 'qa'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | 'admin' | 'developer' | 'qa';
  avatar?: string;
  createdAt: Date;
}