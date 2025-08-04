import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AdminSubCategoryService } from '../../../core/services/admin-subcategory.service';

@Component({
  selector: 'app-admin-subcategory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-subcategory.component.html',
})
export class AdminSubCategoryComponent implements OnInit {
  form!: FormGroup;
  subcategories: any[] = [];
  categories: any[] = [];
  isEdit = false;
  editingId: string | null = null;
  selectedImage: File | null = null;
  isDeletedView = false;

  constructor(
    private fb: FormBuilder,
    private subCategoryService: AdminSubCategoryService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      subcategoryName: [''],
      categoryId: ['']
    });

    this.loadCategories();
    this.loadSubCategories();
  }

  loadCategories(): void {
    this.http.get<any>('http://localhost:3000/api/v1/category/get-by-admin').subscribe({
      next: (res) => {
        this.categories = res.activeCategory.dataActive;
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  loadSubCategories(): void {
    this.subCategoryService.getAllSubCategories().subscribe({
      next: (res) => {
        this.subcategories = this.isDeletedView ? res.deletedSubCategory.dataDeleted : res.activeSubCategory.dataActive;
      },
      error: (err) => console.error(err)
    });
  }

  toggleView(): void {
    this.isDeletedView = !this.isDeletedView;
    this.loadSubCategories();
  }

  handleImageChange(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  submitForm(): void {
    const formData = new FormData();
    formData.append('subcategoryName', this.form.value.subcategoryName);
    formData.append('categoryId', this.form.value.categoryId);
    if (this.selectedImage) {
      formData.append('subcategoryImage', this.selectedImage);
    }

    if (this.isEdit && this.editingId) {
      this.subCategoryService.updateSubCategory(this.editingId, formData).subscribe(() => {
        this.resetForm();
        this.loadSubCategories();
      });
    } else {
      this.subCategoryService.createSubCategory(formData).subscribe(() => {
        this.resetForm();
        this.loadSubCategories();
      });
    }
  }

  editSubCategory(sub: any): void {
    this.isEdit = true;
    this.editingId = sub._id;
    this.form.patchValue({
      subcategoryName: sub.subcategoryName,
      categoryId: sub.categoryId
    });
  }

  deleteSubCategory(id: string): void {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      this.subCategoryService.deleteSubCategory(id).subscribe(() => {
        this.loadSubCategories();
      });
    }
  }


  restoreSubCategory(id: string): void {
  if (confirm('Are you sure you want to restore this subcategory?')) {
    this.subCategoryService.restoreSubCategory(id).subscribe(() => {
      this.loadSubCategories();
    });
  }
}

  resetForm(): void {
    this.form.reset();
    this.isEdit = false;
    this.editingId = null;
    this.selectedImage = null;
  }
}
