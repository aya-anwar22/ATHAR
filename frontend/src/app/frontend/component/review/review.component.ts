import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Review, UserReviewService } from '../../../core/services/user-review.service';

@Component({
  standalone: true,
  selector: 'app-review',
  imports: [CommonModule, FormsModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  newReview = {
    name: '',
    email: '',
    userReview: ''
  };
  showForm: boolean = false;

  constructor(private reviewService: UserReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getAll().subscribe({
      next: (data) => this.reviews = data,
      error: (err) => console.error('Error loading reviews:', err)
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  submitReview(): void {
    this.reviewService.create(this.newReview).subscribe({
      next: (res) => {
        this.newReview = { name: '', email: '', userReview: '' };
        this.showForm = false;
        this.loadReviews();
      },
      error: (err) => console.error('Error submitting review:', err)
    });
  }
}