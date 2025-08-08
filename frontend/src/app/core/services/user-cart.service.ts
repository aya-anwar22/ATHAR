import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CartItem {
  productId: any;
  quantity: number;
  currentPrice: number;
  originalPrice: number;
}

interface CartResponse {
  validItems: CartItem[];
  outdatedItems: any[];
}

@Injectable({ providedIn: 'root' })
export class UserCartService {
  private baseUrl = 'https://athar-snowy.vercel.app/api/v1/cart';

  constructor(private http: HttpClient) {}

  addToCart(productId: string): Observable<any> {
    return this.http.post(this.baseUrl, { productId });
  }

  updateQuantity(productId: string, quantity: number): Observable<any> {
    return this.http.patch(this.baseUrl, { productId, quantity });
  }

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.baseUrl);
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}`);
  }
}
