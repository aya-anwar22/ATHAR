import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminOrderService } from '../../../core/services/admin-order.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-orders',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-orders.component.html'
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: AdminOrderService, private router: Router) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe(res => {
      this.orders = res.orders;
    });
  }

  goToDetails(id: string): void {
    this.router.navigate(['/admin/orders', id]);
  }
}
