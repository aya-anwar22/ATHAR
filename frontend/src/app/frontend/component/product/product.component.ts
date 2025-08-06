import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { UserProductService } from '../../../core/services/user-product.service';
import { UserSubCategoryService } from '../../../core/services/user-subcategory.service';
import { UserProduct } from '../../../core/models/product.model';
import { SubCategory } from '../../../core/models/subcategory.model';
import { UserCartService } from '../../../core/services/user-cart.service';

@Component({
  selector: 'app-user-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: UserProduct[] = [];
  subcategories: SubCategory[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  currentCategory: string | null = null;
  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  alertMessage: string = '';

  constructor(
    private productService: UserProductService,
    private subCategoryService: UserSubCategoryService,
    private cartService: UserCartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentCategory = params['category'] || null;
      this.isLoading = true;
      
      if (this.currentCategory) {
        this.loadProducts(this.currentCategory);
        this.loadSubcategories(this.currentCategory);
      } else {
        this.loadProducts();
        this.subcategories = [];
      }
    });
  }

  private showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    if (type === 'success') {
      this.showSuccessAlert = true;
    } else {
      this.showErrorAlert = true;
    }
    
    setTimeout(() => {
      this.showSuccessAlert = false;
      this.showErrorAlert = false;
    }, 3000);
  }

  loadProducts(categoryId?: string): void {
    this.productService.getAll(categoryId).subscribe({
      next: (res) => {
        this.products = res.activeProdut.dataActive;
        this.isLoading = false;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isLoading = false;
        this.showAlert('Failed to load products', 'error');
      }
    });
  }

  loadSubcategories(categoryId: string): void {
    this.subCategoryService.getByCategoryId(categoryId).subscribe({
      next: (res) => {
        this.subcategories = res.activesubcategory.dataActive;
      },
      error: (err) => {
        console.error('Error fetching subcategories:', err);
        this.showAlert('Subcategories could not be loaded', 'error');
      }
    });
  }

  addToCart(product: UserProduct): void {
    if (product.quantity === 0) return;
    
    this.cartService.addToCart(product._id).subscribe({
      next: () => {
        this.showAlert('Product added to cart!', 'success');
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.showAlert('Failed to add product to cart', 'error');
        if (err.status === 401) {
          this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
        }
      }
    });
  }

  trackByProductId(index: number, product: UserProduct): string {
    return product._id;
  }

  trackBySubcategoryId(index: number, subcategory: SubCategory): string {
    return subcategory._id;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/placeholder.png';
  }
}