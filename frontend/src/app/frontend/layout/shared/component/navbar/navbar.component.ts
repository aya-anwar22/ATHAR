import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Category, CategoryListResponse, UserCategoryService } from '../../../../../core/services/user-category.service';
import { UserCartService } from '../../../../../core/services/user-cart.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent implements OnInit {
  categories: Category[] = [];
  cartItemCount = 0;

  constructor(
    private categoryService: UserCategoryService,
    private cartService: UserCartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.getCartCount();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res: CategoryListResponse) => {
        this.categories = res.activecategory?.dataActive || [];
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  getCartCount(): void {
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cartItemCount = res.validItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
      },
      error: () => {
        this.cartItemCount = 0;
      }
    });
  }

  openCategory(categoryId: string) {
    this.router.navigate(['/category', categoryId]);
  }

  openAllCategories() {
    this.router.navigate(['/categories']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
