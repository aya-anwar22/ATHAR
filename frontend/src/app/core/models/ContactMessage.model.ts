export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isReplyed: boolean;
  adminReply?: string;
  createdAt:Date;
  updatedAt:Date
}

export interface PaginatedMessages {
  currentPage: number;
  totalPages: number;
  totalMessages: number;
  messages: ContactMessage[];
}
