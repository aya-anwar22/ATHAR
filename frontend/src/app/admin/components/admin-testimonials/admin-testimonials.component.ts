import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminReviewService, Review, ReviewsResponse } from '../../../core/services/admin-review.service';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-testimonials.component.html',
  styleUrls: ['./admin-testimonials.component.scss']
})
export class AdminTestimonialsComponent implements OnInit {
  reviews: Review[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  showConfirmModal: boolean = false;
  confirmMessage: string = '';
  reviewToDelete: string | null = null;

  constructor(private reviewService: AdminReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.reviewService.getAll(this.currentPage, this.limit).subscribe({
      next: (res: ReviewsResponse) => {
        console.log('res: ', res);
        this.reviews = res.data;
        this.totalPages = res.totalPages;
        this.currentPage = res.currentPage;
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

  promptDelete(id: string): void {
    this.reviewToDelete = id;
    this.confirmMessage = 'Are you sure you want to delete this review?';
    this.showConfirmModal = true;
  }

  deleteReview(): void {
    if (!this.reviewToDelete) return;

    this.showConfirmModal = false;
    this.reviewService.delete(this.reviewToDelete).subscribe({
      next: (res) => {
        alert(res.message);
        this.loadReviews();
      },
      error: () => {
        alert('Failed to delete review.');
      }
    });

    this.reviewToDelete = null;
  }

  trackById(index: number, item: Review): string {
    return item._id;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadReviews();
    }
  }
}
