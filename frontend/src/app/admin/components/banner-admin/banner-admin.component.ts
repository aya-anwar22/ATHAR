import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../../core/services/banner.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { timer } from 'rxjs';

@Component({
  selector: 'app-banner-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './banner-admin.component.html',
  styleUrls: ['./banner-admin.component.scss']
})
export class BannerAdminComponent implements OnInit {
  banners: any[] = [];
  selectedFile: File | null = null;
  
  // Notification properties
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  showMessage = false;
  progressValue = 0;
  private progressInterval: any;
  
  // Confirmation modal properties
  showConfirmModal = false;
  confirmMessage = '';
  bannerIdToDelete: string | null = null;

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners() {
    this.showProgressMessage('Loading banners...');
    this.bannerService.getBanners().subscribe({
      next: (data) => {
        this.banners = data;
        this.hideMessage();
      },
      error: () => {
        this.showErrorMessage('Failed to load banners');
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addBanner() {
    if (!this.selectedFile) return;

    this.showProgressMessage('Uploading banner...');
    const formData = new FormData();
    formData.append('bannerImage', this.selectedFile);

    this.bannerService.addBanner(formData).subscribe({
      next: () => {
        this.showSuccessMessage('Banner added successfully!');
        this.loadBanners();
        this.selectedFile = null;
      },
      error: () => {
        this.showErrorMessage('Failed to add banner');
      }
    });
  }

  promptDelete(id: string) {
    this.bannerIdToDelete = id;
    this.confirmMessage = 'Are you sure you want to delete this banner?';
    this.showConfirmModal = true;
  }

  confirmActionHandler() {
    if (!this.bannerIdToDelete) return;

    this.showConfirmModal = false;
    this.showProgressMessage('Deleting banner...');

    this.bannerService.deleteBanner(this.bannerIdToDelete).subscribe({
      next: () => {
        this.showSuccessMessage('Banner deleted successfully!');
        this.loadBanners();
      },
      error: () => {
        this.showErrorMessage('Failed to delete banner');
      }
    });

    this.bannerIdToDelete = null;
  }

  // Notification methods
  showProgressMessage(text: string) {
    this.message = text;
    this.messageType = 'info';
    this.showMessage = true;
    this.startProgressBar();
  }

  showSuccessMessage(text: string) {
    this.message = text;
    this.messageType = 'success';
    this.showMessage = true;
    this.stopProgressBar();
    this.autoHideMessage();
  }

  showErrorMessage(text: string) {
    this.message = text;
    this.messageType = 'error';
    this.showMessage = true;
    this.stopProgressBar();
    this.autoHideMessage(5000);
  }

  hideMessage() {
    this.showMessage = false;
    this.stopProgressBar();
  }

  private autoHideMessage(delay = 3000) {
    timer(delay).subscribe(() => this.hideMessage());
  }

  private startProgressBar() {
    this.progressValue = 0;
    this.progressInterval = setInterval(() => {
      this.progressValue += 5;
      if (this.progressValue >= 100) {
        this.progressValue = 100;
      }
    }, 200);
  }

  private stopProgressBar() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
}