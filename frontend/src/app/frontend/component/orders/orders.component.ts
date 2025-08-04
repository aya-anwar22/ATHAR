import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserOrderService } from '../../../core/services/user-order.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-orders',
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: UserOrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res;
      },
      error: () => alert('Failed to load orders'),
    });
  }

  cancelOrder(orderId: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          alert('Order cancelled successfully.');
          this.loadOrders();
        },
        error: () => alert('Failed to cancel order'),
      });
    }
  }

  requestReturn(orderId: string): void {
    if (confirm('Are you sure you want to request a return?')) {
      this.orderService.requestReturn(orderId).subscribe({
        next: () => {
          alert('Return request submitted.');
          this.loadOrders();
        },
        error: () => alert('Failed to request return'),
      });
    }
  }
}
