import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Injectable({ providedIn: 'root' })
export class UserReviewService {
  private baseUrl = 'https://athar-snowy.vercel.app/api/v1/review';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Review[]> {
    return this.http.get<Review[]>(this.baseUrl);
  }

  create(review: { name: string; email: string; userReview: string }): Observable<Review> {
    return this.http.post<Review>(this.baseUrl, review);
  }
}
