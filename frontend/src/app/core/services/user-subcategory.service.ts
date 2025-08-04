import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubCategory, SubCategoryListResponse } from '../models/subcategory.model';


@Injectable({ providedIn: 'root' })
export class UserSubCategoryService {
  private baseUrl = 'http://localhost:3000/api/v1/sub-category';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SubCategoryListResponse> {
    return this.http.get<SubCategoryListResponse>(this.baseUrl);
  }

  getById(id: string): Observable<SubCategory> {
    return this.http.get<SubCategory>(`${this.baseUrl}/${id}`);
  }


  getByCategoryId(categoryId: string): Observable<{ activesubcategory: { dataActive: SubCategory[] } }> {
  return this.http.get<{ activesubcategory: { dataActive: SubCategory[] } }>(
    `${this.baseUrl}?categoryId=${categoryId}`
  );
}

}
