import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollectionService } from '../../../core/services/collection.service';
import { Collection } from '../../../core/models/collections.model';

@Component({
  selector: 'app-collections-filter',  // ✅ لازم يكون ده
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collections-filter.component.html'
})
export class CollectionsFilterComponent implements OnInit {
  collections: Collection[] = [];

  @Output() sortChange = new EventEmitter<string>();
  @Output() priceRangeChange = new EventEmitter<{ min: number; max?: number }>();

  constructor(private collectionService: CollectionService) {}

  ngOnInit(): void {
  this.collectionService.getAllCollectionsForUser(1, 100, false, '').subscribe({
  next: (res: any) => {
    this.collections = res.activeCollections?.dataActive.map((item: any) => ({
      _id: item._id,
      collectionName: item.collectionsName.trim(), // ممكن تضيف trim لو في مسافات زايدة
      collectionSlug: item.collectionsSlug,
      collectionImage: item.collectionsImage,
      isDeleted: item.isDeleted
    })) || [];
  },
  error: (err) => console.error('Failed to load collections:', err)
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
