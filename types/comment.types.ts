import { User } from './user.types';

export interface Comment {
  id: string;
  ticketId: string;
  content: string;
  author: User;
  createdAt: Date;
}