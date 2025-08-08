import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ProfileAdminService {
  private apiUrl = `http://localhost:3000/api/v1/user`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken() || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getUsers(page: number, limit: number, isDeleted: boolean, search: string): Observable<{ users: User[], total: number, totalPages: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search)
      .set('isDeleted', isDeleted.toString());

    return this.http.get<any>(`${this.apiUrl}`, { params }).pipe(
      map(response => {
        if (!isDeleted) {
          return {
            users: response.activeUsers.dataActive || [],
            total: response.activeUsers.total || 0,
            totalPages: response.activeUsers.totalPages || 1
          };
        } else {
          return {
            users: response.deletedUsers.dataDeleted || [],
            total: response.deletedUsers.total || 0,
            totalPages: response.deletedUsers.totalPages || 1
          };
        }
      })
    );
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


  restoreUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

}
