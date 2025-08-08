// import { Component, OnInit, Input, OnChanges } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { UserProductService } from '../../../core/services/user-product.service';
// import { UserCartService } from '../../../core/services/user-cart.service';
// import { UserProduct } from '../../../core/models/product.model';
// import { RouterModule, Router } from '@angular/router';

// @Component({
//   selector: 'app-product-tabs',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './product-tabs.component.html',
//   styleUrls: ['./product-tabs.component.scss']
// })
// export class ProductTabsComponent implements OnInit, OnChanges {
//   @Input() sortBy: string = '';
//   @Input() priceRange: { min: number; max?: number } = { min: 0 };

//   allProducts: UserProduct[] = [];
//   featured: UserProduct[] = [];
//   newAdded: UserProduct[] = [];

//   constructor(
//     private productService: UserProductService,
//     private cartService: UserCartService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.productService.getAll().subscribe({
//       next: (res) => {
//         this.allProducts = res.activeProdut.dataActive || [];
//         this.applyFilters();
//       },
//       error: (err) => console.error('Error fetching products:', err)
//     });
//   }

//   ngOnChanges(): void {
//     this.applyFilters();
//   }

//   applyFilters(): void {
//     let filtered = [...this.allProducts];

//     filtered = filtered.filter(product => {
//       const price = product.price;
//       return (
//         price >= this.priceRange.min &&
//         (this.priceRange.max === undefined || price <= this.priceRange.max)
//       );
//     });

//     if (this.sortBy === 'low-to-high') {
//       filtered.sort((a, b) => a.price - b.price);
//     } else if (this.sortBy === 'high-to-low') {
//       filtered.sort((a, b) => b.price - a.price);
//     }

//     this.featured = filtered;
//     this.newAdded = [...filtered]
//       .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
//       .slice(0, 10);
//   }

//   addToCart(product: UserProduct): void {
//     this.cartService.addToCart(product._id).subscribe({
//       next: () => alert('Product added to cart!'),
//       error: () => alert('Failed to add product to cart')
//     });
//   }

//   goToDetails(id: string): void {
//     this.router.navigate(['/product', id]);
//   }
// }
