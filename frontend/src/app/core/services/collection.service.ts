import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Collection, CollectionPaginationResponse } from '../models/collections.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private apiUrl = `${environment.apiUrl}/collections`;

  constructor(private http: HttpClient) {}

  createCollection(formData: FormData): Observable<Collection> {
    return this.http.post<Collection>(`${this.apiUrl}`, formData);
  }

  getAllCollections(page: number, limit: number, isDeleted: boolean, search: string): Observable<CollectionPaginationResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search)
      .set('isDeleted', isDeleted.toString());
    return this.http.get<CollectionPaginationResponse>(`${this.apiUrl}/get-by-admin`, { params });
  }

  getCollectionBySlug(slug: string): Observable<{ collection: Collection }> {
    return this.http.get<{ collection: Collection }>(`${this.apiUrl}/get-by-admin/${slug}`);
  }

  updateCollection(slug: string, data: FormData): Observable<Collection> {
    return this.http.patch<Collection>(`${this.apiUrl}/${slug}`, data);
  }

  deleteCollection(slug: string): Observable<Collection> {
    return this.http.delete<Collection>(`${this.apiUrl}/${slug}`);
  }

  restoreCollection(slug: string): Observable<Collection> {
    return this.http.delete<Collection>(`${this.apiUrl}/${slug}`);
  }



  // FOR USER
  getAllCollectionsForUser(page: number, limit: number, isDeleted: boolean, search: string): Observable<any> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString())
    .set('isDeleted', isDeleted.toString())
    .set('search', search);

  return this.http.get(`${this.apiUrl}`, { params });
}



getCollectionBySlugForUser(slug: string): Observable<Collection> {
  return this.http.get<Collection>(`${this.apiUrl}/${slug}`);
}

}
