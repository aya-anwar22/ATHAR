import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Brand, BrandPaginationResponse } from '../models/brand.model';

@Injectable({
  providedIn: 'root'
})
export class AdminBrandService {
  private apiUrl = `${environment.apiUrl}/brand`;

  constructor(private http: HttpClient) {}

  createBrand(formData: FormData): Observable<Brand> {
    return this.http.post<Brand>(`${this.apiUrl}`, formData);
  }

  getAllBrands(page: number, limit: number, isDeleted: boolean, search: string): Observable<BrandPaginationResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search)
      .set('isDeleted', isDeleted.toString());
    return this.http.get<BrandPaginationResponse>(`${this.apiUrl}/get-by-admin`, { params });
  }

  getBrandById(id: string): Observable<{ brand: Brand }> {
    return this.http.get<{ brand: Brand }>(`${this.apiUrl}/get-by-admin/${id}`);
  }

  updateBrand(id: string, data: FormData): Observable<Brand> {
    return this.http.put<Brand>(`${this.apiUrl}/${id}`, data);
  }

  deleteBrand(id: string): Observable<Brand> {
    return this.http.patch<Brand>(`${this.apiUrl}/${id}`, {});
  }

  restoreBrand(id: string): Observable<Brand> {
    return this.http.patch<Brand>(`${this.apiUrl}/${id}`, {});
  }
}
