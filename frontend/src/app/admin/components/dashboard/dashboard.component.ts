import { Component, OnInit } from '@angular/core';
import { DashboardData, DashboardService } from '../../../core/services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
    imports: [CommonModule], 

  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardData!: DashboardData;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
  this.dashboardService.getDashboardData().subscribe({
    next: (data) => {
      console.log('Dashboard API response:', data);
      this.dashboardData = data;
    },
    error: (err) => {
      console.error('Error fetching dashboard:', err);
    }
  });
}

  getTotalAmount(order: any): number {
    return order.items.reduce(
      (sum: number, item: any) => sum + (item.priceAtOrderTime * item.quantity),
      0
    );
  }
}
