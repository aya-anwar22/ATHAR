import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserOrderService {
  private baseUrl = 'http://localhost:3000/api/v1/order';

  constructor(private http: HttpClient) {}

  placeOrder(addressId: string): Observable<any> {
    return this.http.post(this.baseUrl, { addressId });
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${orderId}`);
  }

  requestReturn(orderId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${orderId}`, {});
  }

  cancelOrder(orderId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${orderId}/cancel`, {});
  }
}
