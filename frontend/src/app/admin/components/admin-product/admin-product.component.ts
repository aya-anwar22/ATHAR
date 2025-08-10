import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { timer } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { CollectionService } from '../../../core/services/collection.service';
import { Product } from '../../../core/models/product.model';
import { Collection } from '../../../core/models/collections.model';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {
  form!: FormGroup;
  products: Product[] = [];
  collections: Collection[] = [];
  selectedImages: File[] = [];
  previewImages: string[] = [];
  isEdit = false;
  isCreating = false;
  editingSlug: string | null = null;
  editingProduct: Product | null = null;
  isDeletedView = false;
  page = 1;
  limit = 10;
  totalPages = 1;
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  showMessage = false;
  progressValue = 0;
  private progressInterval: any;

  constructor(
    private productService: ProductService,
    private collectionService: CollectionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCollections();
    this.loadProducts();
  }

  initForm() {
    this.form = this.fb.group({
      productName: ['', Validators.required],
      collectionsSlug: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      gender: ['unisex', Validators.required],
      description: [''] ,
      stockAlertThreshold: [1, [Validators.required, Validators.min(0)]]
    });
  }

  loadCollections() {
    this.collectionService.getAllCollections(1, 100, false, '').subscribe({
      next: (res) => {
        const data = res.activeCollections.dataActive;
        this.collections = data.map((item: any) => ({
          collectionName: item.collectionsName,
          collectionSlug: item.collectionsSlug,
          collectionImage: item.collectionsImage,
          _id: item._id
        }));
      },
      error: (err) => this.showErrorMessage('Failed to load collections')
    });
  }

  loadProducts() {
    this.showProgressMessage('Loading products...');
    this.productService.getAll(this.page, this.limit, this.isDeletedView, '').subscribe({
      next: (res) => {
        console.log('res', res)
        const raw = this.isDeletedView ? res.deletedProduct.dataDeleted : res.activeProduct.dataActive;
        this.products = raw;
        this.totalPages = this.isDeletedView
          ? res.deletedProduct.totalPages
          : res.activeProduct.totalPages;
        this.hideMessage();
      },
      error: () => this.showErrorMessage('Failed to load products')
    });
  }

  showActiveProducts() {
    this.isDeletedView = false;
    this.page = 1;
    this.resetForm();
    this.loadProducts();
  }

  showDeletedProducts() {
    this.isDeletedView = true;
    this.page = 1;
    this.resetForm();
    this.loadProducts();
  }

  handleImageChange(event: any) {
    const files: FileList = event.target.files;
    this.selectedImages = Array.from(files);
    this.previewImages = [];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImages.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(image: string) {
    const index = this.previewImages.indexOf(image);
    if (index !== -1) {
      this.previewImages.splice(index, 1);
      this.selectedImages.splice(index, 1);
    }
  }

  submitForm() {
    if (this.form.invalid) {
      this.showErrorMessage('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('productName', this.form.value.productName);
    formData.append('collectionsSlug', this.form.value.collectionsSlug);
    formData.append('price', this.form.value.price.toString());
    formData.append('quantity', this.form.value.quantity.toString());
    formData.append('gender', this.form.value.gender);
    formData.append('stockAlertThreshold', this.form.value.stockAlertThreshold.toString());
    formData.append('description', this.form.value.description);

    this.selectedImages.forEach(file => {
      formData.append('productImages', file);
    });

    this.showProgressMessage(this.isEdit ? 'Updating product...' : 'Creating product...');

    const operation = this.isEdit && this.editingSlug
      ? this.productService.update(this.editingSlug, formData)
      : this.productService.create(formData);

    operation.subscribe({
      next: () => {
        this.showSuccessMessage(this.isEdit ? 'Product updated successfully' : 'Product created successfully');
        this.resetForm();
        this.loadProducts();
      },
      error: (err) => {
        if (err.status === 400 && err.error.message) {
          this.showErrorMessage(err.error.message);
        } else {
          this.showErrorMessage(this.isEdit ? 'Failed to update product' : 'Failed to create product');
        }
      }
    });
  }

  editProduct(product: Product) {
    this.isEdit = true;
    this.isCreating = false;
    this.editingSlug = product.productSlug;
    this.editingProduct = product;
    this.previewImages = [...product.productImages];

    this.form.patchValue({
      productName: product.productName,
      collectionsSlug: product.collectionId?.collectionsSlug,
      price: product.price,
      quantity: product.quantity,
      gender: product.gender,
      description: product.description,
      stockAlertThreshold: product.stockAlertThreshold
    });
  }

  deleteProduct(slug: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.showProgressMessage('Deleting product...');
      this.productService.delete(slug).subscribe({
        next: () => {
          this.showSuccessMessage('Product deleted successfully');
          this.loadProducts();
        },
        error: () => this.showErrorMessage('Failed to delete product')
      });
    }
  }

  restoreProduct(slug: string) {
    if (confirm('Are you sure you want to restore this product?')) {
      this.showProgressMessage('Restoring product...');
      this.productService.restore(slug).subscribe({
        next: () => {
          this.showSuccessMessage('Product restored successfully');
          this.loadProducts();
        },
        error: () => this.showErrorMessage('Failed to restore product')
      });
    }
  }

  resetForm() {
    this.form.reset({
      gender: 'unisex',
      price: 0,
      quantity: 0,
      stockAlertThreshold: 1
    });
    this.selectedImages = [];
    this.previewImages = [];
    this.isEdit = false;
    this.isCreating = false;
    this.editingSlug = null;
    this.editingProduct = null;
  }

  goToPage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadProducts();
    }
  }

  showProgressMessage(text: string) {
    this.message = text;
    this.messageType = 'info';
    this.showMessage = true;
    this.startProgressBar();
  }

  showSuccessMessage(text: string) {
    this.message = text;
    this.messageType = 'success';
    this.showMessage = true;
    this.stopProgressBar();
    this.autoHideMessage();
  }

  showErrorMessage(text: string) {
    this.message = text;
    this.messageType = 'error';
    this.showMessage = true;
    this.stopProgressBar();
    this.autoHideMessage(5000);
  }

  hideMessage() {
    this.showMessage = false;
    this.stopProgressBar();
  }

  private autoHideMessage(delay = 3000) {
    timer(delay).subscribe(() => this.hideMessage());
  }

  private startProgressBar() {
    this.progressValue = 0;
    this.progressInterval = setInterval(() => {
      this.progressValue += 5;
      if (this.progressValue >= 100) this.progressValue = 100;
    }, 200);
  }

  private stopProgressBar() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
}