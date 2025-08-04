import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminBrandService } from '../../../core/services/admin-brand.service';
import { CommonModule } from '@angular/common';
import { Brand } from '../../../core/models/brand.model';

@Component({
  selector: 'app-admin-brand',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-brand.component.html',
  styleUrls: ['./admin-brand.component.scss']
})
export class AdminBrandComponent implements OnInit {
  form!: FormGroup;
  brands: Brand[] = [];
  selectedImage: File | null = null;
  isEdit = false;
  editingId: string | null = null;
  isDeletedView = false;

  page = 1;
  limit = 6;
  totalPages = 1;

  constructor(private brandService: AdminBrandService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      brandName: [''],
      brandImage: [null]
    });
    this.loadBrands();
  }

  loadBrands() {
    this.brandService.getAllBrands(this.page, this.limit, this.isDeletedView, '').subscribe(res => {
      this.brands = this.isDeletedView ? res.deletedBrands.dataDeleted : res.activeBrands.dataActive;
      this.totalPages = this.isDeletedView ? res.deletedBrands.totalPages : res.activeBrands.totalPages;
    });
  }

  handleImageChange(event: any) {
    this.selectedImage = event.target.files[0];
  }

  submitForm() {
    const formData = new FormData();
    formData.append('brandName', this.form.value.brandName);
    if (this.selectedImage) {
      formData.append('brandImage', this.selectedImage);
    }

    if (this.isEdit && this.editingId) {
      this.brandService.updateBrand(this.editingId, formData).subscribe(() => {
        this.resetForm();
        this.loadBrands();
      });
    } else {
      this.brandService.createBrand(formData).subscribe(() => {
        this.resetForm();
        this.loadBrands();
      });
    }
  }

  editBrand(brand: Brand) {
    this.isEdit = true;
    this.editingId = brand._id;
    this.form.patchValue({ brandName: brand.brandName });
  }

  deleteBrand(id: string) {
    if (confirm('Are you sure you want to delete this brand?')) {
      this.brandService.deleteBrand(id).subscribe(() => this.loadBrands());
    }
  }

  restoreBrand(id: string) {
    if (confirm('Are you sure you want to restore this brand?')) {
      this.brandService.restoreBrand(id).subscribe(() => this.loadBrands());
    }
  }

  resetForm() {
    this.form.reset();
    this.selectedImage = null;
    this.isEdit = false;
    this.editingId = null;
  }

  toggleDeletedView() {
    this.isDeletedView = !this.isDeletedView;
    this.page = 1;
    this.loadBrands();
  }

  goToPage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadBrands();
    }
  }
}
