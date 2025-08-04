import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand, BrandPaginationResponse } from '../models/brand.model';
import { environment } from '../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class UserBrandService {
  private apiUrl = `${environment.apiUrl}/brand`;

  constructor(private http: HttpClient) {}

  getBrands(page: number = 1, limit: number = 6, search: string = ''): Observable<BrandPaginationResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search)
      .set('isDeleted', 'false');

    return this.http.get<BrandPaginationResponse>(`${this.apiUrl}`, { params });
  }

  getBrandById(id: string): Observable<{ brand: Brand }> {
    return this.http.get<{ brand: Brand }>(`${this.apiUrl}/${id}`);
  }
}
