import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Product, ProductPaginationResponse } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private baseUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) {}

  getAll(page: number, limit: number, isDeleted: boolean, search: string): Observable<ProductPaginationResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search)
      .set('isDeleted', isDeleted.toString());

    return this.http.get<ProductPaginationResponse>(`${this.baseUrl}/get-by-admin`, { params });
  }

  getById(id: string): Observable<{ message: Product }> {
    return this.http.get<{ message: Product }>(`${this.baseUrl}/get-by-admin/${id}`);
  }

  create(data: FormData): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  update(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  restore(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
