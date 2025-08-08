import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  _id: string;
  categoryName: string;
  categorySlug: string;
  categoryImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CategoryListResponse {
  activecategory: {
    total: number;
    currentPage: number;
    totalPages: number;
    dataActive: Category[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserCategoryService {
  private apiUrl = 'https://athar-snowy.vercel.app/api/v1/category';

  constructor(private http: HttpClient) {}

  getCategories(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Observable<CategoryListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search.trim()) {
      params = params.set('search', search);
    }

    return this.http.get<CategoryListResponse>(this.apiUrl, { params });
  }


  getCategoryById(categoryId: string): Observable<{ category: Category }> {
  return this.http.get<{ category: Category }>(`${this.apiUrl}/${categoryId}`);
}

}
