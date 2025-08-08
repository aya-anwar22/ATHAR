import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface About {
  _id: string;
  bio: string;
  title: string;
  photoUrl: string;
}

@Injectable({ providedIn: 'root' })
export class AdminAboutService {
  private baseUrl = 'https://athar-snowy.vercel.app/api/v1/about';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAbout(): Observable<{ about: About[] }> {
    return this.http.get<{ about: About[] }>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  createAbout(data: FormData): Observable<any> {
    return this.http.post(this.baseUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateAbout(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteAbout(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
