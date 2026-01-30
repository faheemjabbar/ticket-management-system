import { User } from './user.types';

export interface Comment {
  id: string;
  ticketId: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: string;
  attachments?: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
}