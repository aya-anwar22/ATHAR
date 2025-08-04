import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User, UsersApiResponse } from '../models/user.model';
import { environment } from '../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class ProfileAdminService {
private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken() || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

getUsers(page: number, limit: number, isDeleted: boolean, search: string) {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString())
    .set('search', search)
    .set('isDeleted', isDeleted.toString());

  return this.http.get<any>(`${this.apiUrl}`, { params });
}

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUserRole(userId: string, role: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, { role }, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }
}
