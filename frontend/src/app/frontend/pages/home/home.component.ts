import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CategoryFilterComponent } from '../../pages/category-filter/category-filter.component';
import { ProductTabsComponent } from '../../pages/product-tabs/product-tabs.component';
import { HeroComponent } from '../hero/hero.component';
import { ReviewComponent } from '../../component/review/review.component';
import { BrandComponent } from '../../component/brand/brand.component';
import { ContactComponent } from '../../component/contact/contact.component';
import { UserAboutComponent } from '../../component/user-about/user-about.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    RouterOutlet,
    CategoryFilterComponent,
    ProductTabsComponent,
    ReviewComponent,
    ContactComponent,
    UserAboutComponent,
    BrandComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  sortBy: string = '';
  priceRange: { min: number; max?: number } = { min: 0 };

  onSortChanged(value: string) {
    this.sortBy = value;
  }

  onPriceRangeChanged(value: { min: number; max?: number }) {
    this.priceRange = value;
  }
}
