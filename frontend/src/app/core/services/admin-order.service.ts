import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:3000/api/v1/order';

@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<any> {
    return this.http.get(`${BASE_URL}/orders`);
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get(`${BASE_URL}/orders/${id}`);
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${BASE_URL}/orders/${id}`, { status });
  }
}
