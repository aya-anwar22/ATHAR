import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminOrderService } from '../../../core/services/admin-order.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ⬅ مهم علشان [(ngModel)]

@Component({
  standalone: true,
  selector: 'app-admin-orders',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-orders.component.html'
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedStatus: string = '';

  constructor(private orderService: AdminOrderService, private router: Router) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe(res => {
      this.orders = res.orders;
      this.filteredOrders = [...this.orders]; // نسخة أولية
    });
  }

  goToDetails(id: string): void {
    this.router.navigate(['/admin/orders', id]);
  }

  filterOrders(): void {
    if (!this.selectedStatus) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    }
  }
}
