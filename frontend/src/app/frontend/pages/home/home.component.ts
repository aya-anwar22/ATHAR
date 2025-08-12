import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// import { ProductTabsComponent } from '../../pages/product-tabs/product-tabs.component';
import { ReviewComponent } from '../../component/review/review.component';
import { ContactComponent } from '../../component/contact/contact.component';
import { UserAboutComponent } from '../../component/user-about/user-about.component';
import { CollectionComponent } from '../../component/collection/collection.component';
import { ProductListComponent } from '../../component/product-list/product-list.component';
import { BannerComponent } from '../../component/banner/banner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    BannerComponent,
    RouterOutlet,
    CollectionComponent,
    // ProductTabsComponent,
    ReviewComponent,
    ContactComponent,
    UserAboutComponent,
    ProductListComponent
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
