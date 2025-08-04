// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { CommonModule, DatePipe } from '@angular/common';
// import { Category, UserCategoryService } from '../../../core/services/user-category.service';

// @Component({
//   selector: 'app-category-detail',
//   templateUrl: './category-detail.component.html',
//   styleUrls: ['./category-detail.component.scss'],
//   standalone: true,
//   imports: [CommonModule],
//   providers: [DatePipe]
// })
// export class CategoryDetailComponent implements OnInit {
//   categoryId!: string;
//   category?: Category;
//   loading = true;
//   error: string | null = null;

//   constructor(
//     private route: ActivatedRoute,
//     private categoryService: UserCategoryService
//   ) {}

//   ngOnInit(): void {
//     this.route.paramMap.subscribe(params => {
//       this.categoryId = params.get('id')!;
//       this.loadCategory();
//     });
//   }

//   loadCategory(): void {
//     this.loading = true;
//     this.error = null;
//     this.categoryService.getCategoryById(this.categoryId).subscribe({
//       next: (res: { category: Category }) => {
//         this.category = res.category;
//         this.loading = false;
//       },
//       error: (err: any) => {
//         this.error = 'Failed to load category details.';
//         this.loading = false;
//         console.error(err);
//       }
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Category, UserCategoryService } from '../../../core/services/user-category.service';

@Component({
  standalone: true,
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss'],
  imports: [CommonModule]
})
export class CategoryDetailComponent implements OnInit {
  categoryId!: string;
  category?: Category;

  constructor(
    private route: ActivatedRoute,
    private categoryService: UserCategoryService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id')!;
      this.loadCategory();
    });
  }

  loadCategory(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (res: { category: Category }) => {
        this.category = res.category;
      },
      error: (err: any) => {
        console.error('Failed to load category details.', err);
      }
    });
  }
}
