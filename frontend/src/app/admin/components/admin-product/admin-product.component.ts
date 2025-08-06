// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AdminProductService } from '../../../core/services/admin-product.service';
// import { Product } from '../../../core/models/product.model';
// import { AdminBrandService } from '../../../core/services/admin-collection.service';
// import { AdminSubCategoryService } from '../../../core/services/admin-subcategory.service';
// import { Brand } from '../../../core/models/collections .model';
// import { SubCategory } from '../../../core/models/subcategory.model';

// @Component({
//   selector: 'app-admin-product',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './admin-product.component.html',
//   styleUrl: './admin-product.component.scss'

// })
// export class AdminProductComponent implements OnInit {
//   form!: FormGroup;
//   products: Product[] = [];
//   brands: Brand[] = [];
//   subcategories: SubCategory[] = [];
//   selectedImage: File | null = null;
//   isEdit = false;
//   editingId: string | null = null;
//   isDeletedView = false;
//   page = 1;
//   limit = 5;
//   totalPages = 1;

//   constructor(
//     private fb: FormBuilder,
//     private productService: AdminProductService,
//     private brandService: AdminBrandService,
//     private subCategoryService: AdminSubCategoryService
//   ) { }

//   ngOnInit(): void {
//     this.form = this.fb.group({
//       productName: [''],
//       price: [''],
//       quantity: [''],
//       gender: [''],
//       stockAlertThreshold: [''],
//       brandId: [''],
//       subcategoryId: [''],
//     });

//     this.loadProducts();
//     this.loadBrands();
//     this.loadSubCategories();
//   }

//   loadProducts(): void {
//     this.productService.getAll(this.page, this.limit, this.isDeletedView, '').subscribe(res => {
//       this.products = this.isDeletedView ? res.deletedProduct.dataDeleted : res.activeProduct.dataActive;
//       this.totalPages = this.isDeletedView ? res.deletedProduct.totalPages : res.activeProduct.totalPages;
//     });
//   }

//   loadBrands(): void {
//     this.brandService.getAllBrands(1, 50, false, '').subscribe(res => {
//       this.brands = res.activeBrands.dataActive;
//     });
//   }

//   loadSubCategories(): void {
//     this.subCategoryService.getAllSubCategories().subscribe(res => {
//       this.subcategories = res.activeSubCategory.dataActive;
//     });
//   }

//   handleImageChange(event: any): void {
//     this.selectedImage = event.target.files[0];
//   }

//   submitForm(): void {
//     const formData = new FormData();
//     const formValue = this.form.value;
//     for (let key in formValue) {
//       formData.append(key, formValue[key]);
//     }
//     if (this.selectedImage) {
//       formData.append('productImages', this.selectedImage);
//     }

//     if (this.isEdit && this.editingId) {
//       this.productService.update(this.editingId, formData).subscribe(() => {
//         this.resetForm();
//         this.loadProducts();
//       });
//     } else {
//       this.productService.create(formData).subscribe(() => {
//         this.resetForm();
//         this.loadProducts();
//       });
//     }
//   }

//   editProduct(product: Product): void {
//     this.isEdit = true;
//     this.editingId = product._id;
//     this.form.patchValue(product);
//   }

//   deleteProduct(id: string): void {
//     if (confirm('Are you sure you want to delete this product?')) {
//       this.productService.delete(id).subscribe(() => this.loadProducts());
//     }
//   }

//   restoreProduct(id: string): void {
//     if (confirm('Are you sure you want to restore this product?')) {
//       this.productService.restore(id).subscribe(() => {
//         this.loadProducts();
//       });
//     }
//   }

//   toggleView(): void {
//     this.isDeletedView = !this.isDeletedView;
//     this.page = 1;
//     this.loadProducts();
//   }

//   resetForm(): void {
//     this.form.reset();
//     this.selectedImage = null;
//     this.isEdit = false;
//     this.editingId = null;
//   }

//   nextPage(): void {
//     if (this.page < this.totalPages) {
//       this.page++;
//       this.loadProducts();
//     }
//   }

//   prevPage(): void {
//     if (this.page > 1) {
//       this.page--;
//       this.loadProducts();
//     }
//   }
// }
