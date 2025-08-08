import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedMessages } from '../models/ContactMessage.model';
import { ContactMessage } from '../models/ContactMessage.model';


@Injectable({
  providedIn: 'root'
})
export class AdminContactService {
  private baseUrl = 'https://athar-snowy.vercel.app/api/v1/contact';

  constructor(private http: HttpClient) {}

  getMessages(page: number = 1, limit: number = 10): Observable<{
  currentPage: number;
  totalPages: number;
  totalMessages: number;
  messages: ContactMessage[];
}> {
  return this.http.get<{
    currentPage: number;
    totalPages: number;
    totalMessages: number;
    messages: ContactMessage[];
  }>(`${this.baseUrl}?page=${page}&limit=${limit}`);
}



  replyToMessage(messageId: string, adminReply: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reply-admin`, { messageId, adminReply });
  }
}
