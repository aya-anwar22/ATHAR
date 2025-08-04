import { Component, OnInit } from '@angular/core';
import {
  Category,
  UserCategoryService
} from '../../../core/services/user-category.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  error: string | null = null;

  constructor(private categoryService: UserCategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(page: number = 1, limit: number = 10, search: string = ''): void {
    this.loading = true;
    this.error = null;
    this.categoryService.getCategories(page, limit, search).subscribe({
      next: (res) => {
        this.categories = res.activecategory?.dataActive || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}

