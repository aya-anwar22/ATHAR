import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class AdminSubCategoryService {
  private apiUrl = `${environment.apiUrl}/sub-category`;

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

