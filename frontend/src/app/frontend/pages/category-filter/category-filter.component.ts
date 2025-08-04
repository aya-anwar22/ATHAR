import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserCategoryService, Category } from '../../../core/services/user-category.service';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-filter.component.html'
})
export class CategoryFilterComponent implements OnInit {
  categories: Category[] = [];

  @Output() sortChange = new EventEmitter<string>();
  @Output() priceRangeChange = new EventEmitter<{ min: number; max?: number }>();

  constructor(private categoryService: UserCategoryService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.activecategory?.dataActive || [];
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  onSortChange(event: any) {
    this.sortChange.emit(event.target.value);
  }

  priceOptions = [
    { id: 'p1', label: 'EGP 0 - EGP 200' },
    { id: 'p2', label: 'EGP 200 - EGP 400' },
    { id: 'p3', label: 'EGP 400 - EGP 600' },
    { id: 'p4', label: 'EGP 600 - EGP 800' },
    { id: 'p5', label: 'EGP 800+' }
  ];
  onPriceRangeChange(range: string) {
    const ranges: any = {
      p1: { min: 0, max: 200 },
      p2: { min: 200, max: 400 },
      p3: { min: 400, max: 600 },
      p4: { min: 600, max: 800 },
      p5: { min: 800 } 
    };
    this.priceRangeChange.emit(ranges[range]);
  }
}
