import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Brand } from '../../../core/models/brand.model';
import { UserBrandService } from '../../../core/services/user-brand.service';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './brand.component.html'
})
export class BrandComponent implements OnInit {
  brands: Brand[] = [];
  totalPages = 1;
  currentPage = 1;
  totalBrands = 0;
  limit = 6;

  constructor(private brandService: UserBrandService, private router: Router) {}

  ngOnInit(): void {
    this.fetchBrands(this.currentPage);
  }

  fetchBrands(page: number): void {
    this.brandService.getBrands(page, this.limit).subscribe({
      next: (res) => {
        this.brands = res.activeBrands.dataActive;
        this.totalPages = res.activeBrands.totalPages;
        this.totalBrands = res.activeBrands.total;
        this.currentPage = res.activeBrands.currentPage;
        console.log('Loaded brands:', this.brands);
      },
      error: (err) => console.error('Failed to load brands', err)
    });
  }

  goToBrandDetail(id: string): void {
  this.router.navigate(['/products'], { queryParams: { brand: id } });
}


  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchBrands(page);
    }
  }
}
