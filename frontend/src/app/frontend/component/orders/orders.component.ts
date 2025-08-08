
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserOrderService } from '../../../core/services/user-order.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // لازم لـ ngModel

@Component({
  standalone: true,
  selector: 'app-orders',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  allOrders: any[] = [];  // كل الطلبات من السيرفر
  orders: any[] = [];     // الطلبات اللي هتعرضها بعد الفلترة
  selectedStatus: string = '';

  constructor(private orderService: UserOrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.allOrders = res;
        this.filterOrders(); // نفذ فلترة مبدئية
      },
      error: () => alert('Failed to load orders'),
    });
  }

  filterOrders(): void {
    if (!this.selectedStatus) {
      this.orders = this.allOrders;
    } else {
      this.orders = this.allOrders.filter(order => order.status === this.selectedStatus);
    }
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

  getOrderTotal(order: any): number {
  return order.items.reduce((total: number, item: any) => {
    return total + (item.quantity * item.priceAtOrderTime);
  }, 0);
}

}



