import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSubCategoryService } from '../../../core/services/user-subcategory.service';
import { RouterModule } from '@angular/router';
import { SubCategory } from '../../../core/models/subcategory.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-subcategory',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subcategory.component.html',
})
export class SubcategoryComponent implements OnInit {
  subcategories: SubCategory[] = [];

  constructor(
  private subCategoryService: UserSubCategoryService,
  private route: ActivatedRoute
) {}

ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    const categoryId = params['category'];
    if (categoryId) {
      this.loadSubCategories(categoryId);
    }
  });
}

loadSubCategories(categoryId: string): void {
  this.subCategoryService.getByCategoryId(categoryId).subscribe({
    next: (res) => {
      this.subcategories = res.activesubcategory.dataActive;
    },
    error: (err) => console.error('Error loading subcategories:', err)
  });
}

}