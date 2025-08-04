import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserProductService } from '../../../core/services/user-product.service';
import { UserProduct } from '../../../core/models/product.model';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  product?: UserProduct;

  constructor(
    private route: ActivatedRoute,
    private productService: UserProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getById(id).subscribe({
        next: (res) => this.product = res,
        error: (err) => console.error('Error loading product:', err)
      });
    }
  }

  addToCart(): void {
    this.router.navigate(['/cart']);
  }
}
