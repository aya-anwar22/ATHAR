import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { UserProductService } from '../../../core/services/user-product.service';
import { UserSubCategoryService } from '../../../core/services/user-subcategory.service'; // ⬅️ جديد
import { UserProduct } from '../../../core/models/product.model';
import { SubCategory } from '../../../core/models/subcategory.model'; // ⬅️ جديد
import { UserCartService } from '../../../core/services/user-cart.service';

@Component({
  selector: 'app-user-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  products: UserProduct[] = [];
  subcategories: SubCategory[] = []; 

  constructor(
    private productService: UserProductService,
    private subCategoryService: UserSubCategoryService, 
    private cartService: UserCartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const categoryId = params['category'];
      if (categoryId) {
        this.loadProducts(categoryId);
        this.loadSubcategories(categoryId); 

      } else {
        this.loadProducts();
      }
    });
  }

  loadProducts(categoryId?: string): void {
    this.productService.getAll(categoryId).subscribe({
      next: (res) => {
        this.products = res.activeProdut.dataActive;
          console.log('Loaded products:', this.products);

      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  loadSubcategories(categoryId: string): void {
    this.subCategoryService.getByCategoryId(categoryId).subscribe({
      next: (res) => {
        this.subcategories = res.activesubcategory.dataActive;
      },
      error: (err) => console.error('Error fetching subcategories:', err)
    });
  }

  addToCart(product: UserProduct): void {
    this.cartService.addToCart(product._id).subscribe({
      next: () => {
        alert('Product added to cart successfully!');
        this.router.navigate(['/cart']);
      },
      error: () => alert('Failed to add product to cart')
    });
  }
}
