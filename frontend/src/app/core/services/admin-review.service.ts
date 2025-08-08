import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  _id: string;
  name: string;
  email: string;
  userReview: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  data: Review[];
  total: number;
  currentPage: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class AdminReviewService {
  private baseUrl = 'https://athar-snowy.vercel.app/api/v1/review';

  constructor(private http: HttpClient) {}

  getAll(page: number, limit: number): Observable<ReviewsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ReviewsResponse>(`${this.baseUrl}/admin`, { params });
  }

  approve(id: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/${id}`, {});
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
