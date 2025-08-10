import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
/////
import {
  ForgetPasswordData,
  ForgetPasswordResponse,
  LoginData,
  LoginResponse,
  ResetPasswordData,
  ResetPasswordResponse,
  SignupData,
  SignupResponse,
  VerifyEmailData,
  VerifyEmailResponse
} from '../models/auth.model';

interface IUser {
  userName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private readonly TOKEN_KEY = 'accessToken';
  private apiUrl = `https://athar-snowy.vercel.app/v1/auth`;

setRefreshToken(token: string): void {
  localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
}

getRefreshToken(): string | null {
  return localStorage.getItem(this.REFRESH_TOKEN_KEY);
}

refreshToken(): Observable<{ accessToken: string }> {
  const refreshToken = this.getRefreshToken();
  return this.http.post<{ accessToken: string }>(
    `${this.apiUrl}/refresh-token`,
    { refreshToken }
  );
}
  private myUser = new BehaviorSubject<IUser | null>(null);
  public user$ = this.myUser.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      try {
        const user = this.decode(token);
        this.myUser.next(user);
      } catch (error) {
        console.error('Failed to decode token on service init:', error);
        this.myUser.next(null);
      }
    }
  }

  signup(data: SignupData): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.apiUrl}/sign-up`, data);
  }

  verifyEmail(data: VerifyEmailData): Observable<VerifyEmailResponse> {
    return this.http.post<VerifyEmailResponse>(`${this.apiUrl}/verify-email`, data);
  }

  login(credentials: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        this.setToken(res.accessToken);
        const user = this.decode(res.accessToken);
        this.myUser.next(user);
        console.log('User Name:', user.userName);
        console.log('User Role:', user.role);
      })
    );
  }

  forgetPassword(data: ForgetPasswordData): Observable<ForgetPasswordResponse> {
    return this.http.post<ForgetPasswordResponse>(`${this.apiUrl}/forget-password`, data);
  }

  resetPassword(data: ResetPasswordData): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(`${this.apiUrl}/rest-password`, data);
  }



  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  decode(token: string): IUser {
    return jwtDecode<IUser>(token);
  }

  getRole(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token ? this.decode(token).role : null;
  }

  getUserName(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;
    const user = this.decode(token);
    return user.userName || null;
  }


  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.myUser.next(null);
  }
}
