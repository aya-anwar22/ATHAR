import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminBrandService } from '../../../core/services/admin-brand.service';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {
  message = '';
  brandName = '';
  brandImage!: File;
  isEditing = false;
  editingId: string | null = null;

  brands: any[] = [];
  currentPage = 1;
  totalPages = 1;
  limit = 6;
  isDeleted = false;
  search = '';

  constructor(private brandService: AdminBrandService) {}

  ngOnInit(): void {
    this.fetchBrands();
  }

  fetchBrands(): void {
    this.brandService.getAllBrands(this.currentPage, this.limit, this.isDeleted, this.search).subscribe({
      next: (res: any) => {
        const dataKey = this.isDeleted ? 'deletedBrands' : 'activeBrands';
        this.brands = res[dataKey]?.[`data${this.isDeleted ? 'Deleted' : 'Active'}`] || [];
        this.totalPages = res[dataKey]?.totalPages || 1;
      },
      error: (err) => {
        console.error('Error fetching brands:', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.brandImage = file;
    }
  }

  submitForm(): void {
    if (!this.brandName || (!this.brandImage && !this.isEditing)) {
      this.message = 'Please fill in all fields';
      return;
    }

    const formData = new FormData();
    formData.append('brandName', this.brandName);
    if (this.brandImage) formData.append('brandImage', this.brandImage);

    const obs = this.isEditing && this.editingId
      ? this.brandService.updateBrand(this.editingId, formData)
      : this.brandService.createBrand(formData);

    obs.subscribe({
      next: () => {
        this.message = this.isEditing ? 'Updated successfully' : 'Created successfully';
        this.resetForm();
        this.fetchBrands();
      },
      error: (err) => {
        console.error(err);
        this.message = this.isEditing ? 'Update failed' : 'Create failed';
      }
    });
  }

  updateBrand(brand: any): void {
    this.brandName = brand.brandName;
    this.editingId = brand._id;
    this.isEditing = true;
  }

  deleteBrand(id: string): void {
    if (confirm('Are you sure you want to delete this brand?')) {
      this.brandService.deleteBrand(id).subscribe({
        next: () => {
          this.message = 'Deleted successfully';
          this.fetchBrands();
        },
        error: (err) => {
          console.error(err);
          this.message = 'Deleting failed';
        }
      });
    }
  }

  resetForm(): void {
    this.brandName = '';
    this.brandImage = {} as File;
    this.isEditing = false;
    this.editingId = null;
  }

  // pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchBrands();
    }
  }

  toggleDeleted(): void {
    this.isDeleted = !this.isDeleted;
    this.currentPage = 1;
    this.fetchBrands();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.fetchBrands();
  }


  restoreBrand(id: string): void {
  if (confirm('Are you sure you want to restore this brand?')) {
    this.brandService.restoreBrand(id).subscribe({
      next: () => {
        this.message = 'Brand restored successfully';
        this.fetchBrands();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed to restore brand';
      }
    });
  }
}

}
