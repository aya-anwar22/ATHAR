// 🟦 admin-category.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Categry, CategryPaginationResponse } from '../../../core/models/category.model';
import { AdminCategoryService } from '../../../core/services/admin-category.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {
  form!: FormGroup;
  categories: Categry[] = [];
  deletedCategories: Categry[] = [];
  selectedImage: File | null = null;
  isEdit = false;
  editingId: string | null = null;
  showDeleted = false;
  page = 1;
  limit = 6;
  totalPages = 1;

  constructor(private categoryService: AdminCategoryService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      categoryName: ['', Validators.required],
    });
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService
      .getAllCategories(this.page, this.limit, this.showDeleted, '')
      .subscribe((res: CategryPaginationResponse) => {
        if (this.showDeleted) {
          this.deletedCategories = res.deletedCategory.dataDeleted;
          this.totalPages = res.deletedCategory.totalPages;
        } else {
          this.categories = res.activeCategory.dataActive;
          this.totalPages = res.activeCategory.totalPages;
        }
      });
  }

  handleImageChange(event: any) {
    this.selectedImage = event.target.files[0];
  }

  submitForm() {
    const formData = new FormData();
    formData.append('categoryName', this.form.value.categoryName);
    if (this.selectedImage) {
      formData.append('categoryImage', this.selectedImage);
    }

    if (this.isEdit && this.editingId) {
      this.categoryService.updateCategory(this.editingId, formData).subscribe(() => {
        this.resetForm();
        this.loadCategories();
      });
    } else {
      this.categoryService.createCategory(formData).subscribe(() => {
        this.resetForm();
        this.loadCategories();
      });
    }
  }

  editCategory(category: Categry) {
    this.isEdit = true;
    this.editingId = category._id;
    this.form.patchValue({ categoryName: category.categoryName });
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this Category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => this.loadCategories());
    }
  }

  restoreCategory(id: string) {
    if (confirm('Are you sure you want to restore this Category?')) {
      this.categoryService.restoreCategory(id).subscribe(() => this.loadCategories());
    }
  }

  toggleDeletedView(): void {
    this.showDeleted = !this.showDeleted;
    this.page = 1;
    this.loadCategories();
  }

  goToPage(p: number): void {
    if (p >= 1 && p <= this.totalPages) {
      this.page = p;
      this.loadCategories();
    }
  }

  resetForm() {
    this.form.reset();
    this.selectedImage = null;
    this.isEdit = false;
    this.editingId = null;
  }
}
