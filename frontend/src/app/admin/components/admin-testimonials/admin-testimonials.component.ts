import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminReviewService, Review } from '../../../core/services/admin-review.service';
@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-testimonials.component.html'
})
export class AdminTestimonialsComponent implements OnInit {
  reviews: Review[] = [];
  isLoading: boolean = false;

  constructor(private reviewService: AdminReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.reviewService.getAll().subscribe({
      next: (data) => {
        this.reviews = data;
      },
      error: () => {
        alert('Error loading reviews.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  approveReview(id: string): void {
    this.reviewService.approve(id).subscribe({
      next: (res) => {
        alert(res.message);
        this.loadReviews();
      },
      error: () => {
        alert('Failed to approve review.');
      }
    });
  }

  deleteReview(id: string): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.delete(id).subscribe({
        next: (res) => {
          alert(res.message);
          this.loadReviews();
        },
        error: () => {
          alert('Failed to delete review.');
        }
      });
    }
  }

  trackById(index: number, item: Review): string {
    return item._id;
  }
}
