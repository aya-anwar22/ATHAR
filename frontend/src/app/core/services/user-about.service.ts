import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AboutResponse {
  about: {
    _id: string;
    title: string;
    bio: string;
    photoUrl: string;
  }[];
}

@Injectable({ providedIn: 'root' })
export class UserAboutService {
  private baseUrl = 'http://localhost:3000/api/v1/about';

  constructor(private http: HttpClient) {}

  getAbout(): Observable<AboutResponse> {
    return this.http.get<AboutResponse>(this.baseUrl);
  }
}
