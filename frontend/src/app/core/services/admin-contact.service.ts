import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isReplyed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminContactService {
  private baseUrl = 'http://localhost:3000/api/v1/contact';

  constructor(private http: HttpClient) {}

  getMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.baseUrl);
  }

  replyToMessage(messageId: string, adminReply: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reply-admin`, { messageId, adminReply });
  }
}
