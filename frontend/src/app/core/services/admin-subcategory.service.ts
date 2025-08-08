import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminSubCategoryService {
  private apiUrl = `https://athar-4yleiuf7p-aya-anwar-372ab2cd.vercel.app/api/v1/sub-category`;

  constructor(private http: HttpClient) {}

  createSubCategory(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  getAllSubCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-by-admin`);
  }

  getSubCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-by-admin/${id}`);
  }

  updateSubCategory(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteSubCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  restoreSubCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}

