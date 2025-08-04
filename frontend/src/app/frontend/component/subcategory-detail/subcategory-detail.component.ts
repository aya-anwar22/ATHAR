import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubCategory } from '../../../core/models/subcategory.model';
import { UserSubCategoryService } from '../../../core/services/user-subcategory.service';
import { UserProductService } from '../../../core/services/user-product.service';
import { UserProduct } from '../../../core/models/product.model';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-subcategory-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './subcategory-detail.component.html'
})
export class SubCategoryDetailComponent implements OnInit {
  subcategory?: SubCategory;
  products: UserProduct[] = [];

  constructor(
    private route: ActivatedRoute,
    private subCatService: UserSubCategoryService,
    private productService: UserProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.subCatService.getById(id).subscribe({
        next: (res) => {
          this.subcategory = res;
        },
        error: (err) => console.error('Error loading subcategory details', err)
      });

      this.productService.getAllBySubcategory(id).subscribe({
        next: (res) => {
          this.products = res.activeProdut.dataActive;
        },
        error: (err) => console.error('Error loading products by subcategory', err)
      });
    }
  }
}
