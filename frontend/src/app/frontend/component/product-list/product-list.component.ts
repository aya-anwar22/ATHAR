import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { UserCartService } from '../../../core/services/user-cart.service';  // <-- استيراد
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @Input() isHomeView: boolean = false;
  products: any[] = [];
  displayedProducts: any[] = [];
  selectedProduct: any = null;
  collectionsSlug: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: UserCartService,   // <-- حقن الخدمة
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.collectionsSlug = params.get('collectionsSlug');
      this.fetchProducts();
    });
  }

  fetchProducts(): void {
    this.productService.getAllByUser(this.collectionsSlug || '').subscribe({
      next: (res) => {
        this.products = res.activeProduct.dataActive;
        this.displayedProducts = this.isHomeView 
          ? this.products.slice(0, 10) 
          : this.products;
      },
      error: (err) => {
        console.error('Error fetching products', err);
      }
    });
  }

  viewProductDetails(product: any): void {
    this.selectedProduct = product;
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

addToCart(product: any, event: MouseEvent): void {
  event.stopPropagation();

  if (product.quantity <= 0) {
    alert('This product is out of stock and cannot be added to the cart.');
    return;
  }

  this.cartService.addToCart(product._id).subscribe({
    next: () => {
      alert(`Product ${product.productName} added to cart successfully.`);
    },
    error: (err) => {
      const serverMessage = err.error?.message || 'Failed to add product to cart.';
      alert(serverMessage);
      console.error('Add to cart error:', err);
    }
  });
}



  getStockMessage(quantity: number): string | null {
    if (quantity === 0) {
      return 'Out of stock';
    } else if (quantity < 5) {
      return `Only ${quantity} left`;
    }
    return null;
  }
}
