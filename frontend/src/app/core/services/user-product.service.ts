
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductListResponse, UserProduct } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class UserProductService {
  private baseUrl = 'http://localhost:3000/api/v1/product';

  constructor(private http: HttpClient) {}

getAll(categoryId?: string, brandId?: string): Observable<ProductListResponse> {
  let params = new HttpParams();

  if (categoryId) {
    params = params.set('category', categoryId);
  }

  if (brandId) {
    params = params.set('brand', brandId);
  }

  return this.http.get<ProductListResponse>(this.baseUrl, { params });
}


  getById(id: string): Observable<UserProduct> {
    return this.http.get<UserProduct>(`${this.baseUrl}/${id}`);
  }


  getAllBySubcategory(subcategoryId: string): Observable<ProductListResponse> {
  return this.http.get<ProductListResponse>(`${this.baseUrl}?subcategory=${subcategoryId}`);
}

}
