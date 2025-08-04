import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminOrderService } from '../../../core/services/admin-order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-admin-order-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-order-detail.component.html'
})
export class AdminOrderDetailComponent implements OnInit {
  order: any;
  selectedStatus = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: AdminOrderService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getOrderById(id).subscribe(res => {
        this.order = res.order;
        this.selectedStatus = res.order.status;
      });
    }
  }

  updateStatus(): void {
    if (!this.order?._id || !this.selectedStatus) return;
    this.orderService.updateStatus(this.order._id, this.selectedStatus).subscribe(() => {
      alert('Status updated!');
    });
  }
}
