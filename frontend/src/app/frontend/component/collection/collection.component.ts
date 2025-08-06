import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../core/services/collection.service';
import { Collection } from '../../../core/models/collections.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  collections: Collection[] = [];
  loading = false;
  errorMessage = '';

  // ✅ Pagination variables
  page = 1;
  limit = 6;
  totalPages = 1;

  constructor(private collectionService: CollectionService) {}

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
  this.loading = true;

  this.collectionService.getAllCollectionsForUser(this.page, this.limit, false, '').subscribe({
    next: (res: any) => {
      const rawData = res.activeCollections;

      // ✅ أطبع البيانات كاملة من الـ API
      console.log('📦 API Response:', res);
      console.log('📂 activeCollections:', rawData);
      console.log('📄 dataActive:', rawData?.dataActive);

      // تعديل البيانات علشان توافق الـ model
      this.collections = rawData?.dataActive.map((item: any) => ({
        _id: item._id,
        collectionName: item.collectionsName,
        collectionSlug: item.collectionsSlug,
        collectionImage: item.collectionsImage,
        isDeleted: item.isDeleted
      })) || [];

      this.totalPages = rawData?.totalPages || 1;
      this.loading = false;
    },
    error: (err) => {
      console.error('❌ Error fetching collections:', err);
      this.errorMessage = 'Failed to load collections';
      this.loading = false;
    }
  });
}


  goToPage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadCollections();
    }
  }
}
