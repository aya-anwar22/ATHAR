import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Categry, CategryPaginationResponse } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class AdminCategoryService {
  private apiUrl = `https://athar-4yleiuf7p-aya-anwar-372ab2cd.vercel.app/api/v1/category`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  createCategory(formData: FormData): Observable<Categry> {
    return this.http.post<Categry>(this.apiUrl, formData);
  }

  getAllCategories(page: number, limit: number, isDeleted: boolean, search: string = ''): Observable<CategryPaginationResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('isDeleted', isDeleted.toString())
      .set('search', search);

    return this.http.get<CategryPaginationResponse>(`${this.apiUrl}/get-by-admin`, { params });
  }

  getCategoryById(categoryId: string): Observable<{ category: Categry }> {
    return this.http.get<{ category: Categry }>(`${this.apiUrl}/${categoryId}`);
  }

  updateCategory(categoryId: string, formData: FormData): Observable<Categry> {
    return this.http.put<Categry>(`${this.apiUrl}/${categoryId}`, formData);
  }

  deleteCategory(categoryId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${categoryId}`);
  }

  restoreCategory(categoryId: string): Observable<Categry> {
    return this.http.delete<Categry>(`${this.apiUrl}/${categoryId}`, {});
  }
}
