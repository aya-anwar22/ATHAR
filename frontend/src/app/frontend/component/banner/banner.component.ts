import { Component, OnInit } from '@angular/core';
import { Banner } from '../../../core/models/banner.model';
import { BannerService } from '../../../core/services/banner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  imports: [
    CommonModule
  ],
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  banners: Banner[] = [];

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {
    this.bannerService.getBanners().subscribe({
      next: (data) => {
        console.log('Banners from API:', data); // طباعة الداتا
        this.banners = data;
      },
      error: (err) => console.error('Error fetching banners:', err)
    });
  }
}
