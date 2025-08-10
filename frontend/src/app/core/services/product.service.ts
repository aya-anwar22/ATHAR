// src/app/services/admin-product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductPaginationResponse } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = `http://localhost:3000/api/v1/product`;

  constructor(private http: HttpClient) {}

  getAll(page: number, limit: number, isDeleted: boolean, search: string): Observable<ProductPaginationResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search)
      .set('isDeleted', isDeleted.toString());

    return this.http.get<ProductPaginationResponse>(`${this.baseUrl}/get-by-admin`, { params });
  }

  getBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/get-by-admin/${slug}`);
  }

  create(productData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, productData);
  }

  update(slug: string, productData: FormData): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${slug}`, productData);
  }

  removeImage(slug: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/remove-image/${slug}`, {});
  }

  delete(slug: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${slug}`);
  }

  restore(slug: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${slug}`);
  }





  // BY USER
  getAllByUser(collectionsSlug: string = ''): Observable<any> {
  let params = new HttpParams();
  if (collectionsSlug) {
    params = params.set('collectionsSlug', collectionsSlug);
  }

  return this.http.get(`${this.baseUrl}`, { params });
}



  getBySlugByUser(slug: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/${slug}`);
}

}
