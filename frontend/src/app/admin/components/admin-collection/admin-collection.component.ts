import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Collection } from '../../../core/models/collections.model';
import { timer } from 'rxjs';
import { CollectionService } from '../../../core/services/collection.service';

@Component({
  selector: 'app-admin-collection',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-collection.component.html',
  styleUrls: ['./admin-collection.component.scss']
})
export class AdminCollectionComponent implements OnInit {
  form!: FormGroup;
  collections: Collection[] = [];
  selectedImage: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
  isEdit = false;
  isCreating = false;
  editingSlug: string | null = null;
  editingCollection: Collection | null = null;
  isDeletedView = false;
  showConfirmModal = false;
  confirmAction: 'delete' | 'restore' | null = null;
  currentSlug: string | null = null;
  confirmMessage = '';

  page = 1;
  limit = 10;
  totalPages = 1;

  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  showMessage = false;
  progressValue = 0;
  private progressInterval: any;

  constructor(private collectionService: CollectionService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCollections();
  }

  initForm() {
    this.form = this.fb.group({
      collectionName: ['', Validators.required],
      collectionImage: [null]
    });
  }

  loadCollections() {
    this.showProgressMessage('Loading collections...');
    this.collectionService.getAllCollections(this.page, this.limit, this.isDeletedView, '').subscribe({
      next: (res) => {
        const rawCollections = this.isDeletedView ? res.deletedCollections.dataDeleted : res.activeCollections.dataActive;
        this.collections = rawCollections.map((item: any) => ({
          collectionName: item.collectionsName,
          collectionSlug: item.collectionsSlug,
          collectionImage: item.collectionsImage
        }));

        this.totalPages = this.isDeletedView
          ? res.deletedCollections.totalPages
          : res.activeCollections.totalPages;
        this.hideMessage();
      },
      error: () => {
        this.showErrorMessage('Failed to load collections');
      }
    });
  }

  showCreateForm() {
    this.isCreating = true;
    this.isEdit = false;
    this.editingSlug = null;
    this.editingCollection = null;
    this.form.reset();
  }

  handleImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm() {
    if (this.form.invalid) {
      this.showErrorMessage('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('collectionsName', this.form.value.collectionName);
    if (this.selectedImage) {
      formData.append('collectionsImage', this.selectedImage);
    }

    this.showProgressMessage(this.isEdit ? 'Updating collection...' : 'Creating collection...');

    const operation = this.isEdit && this.editingSlug
      ? this.collectionService.updateCollection(this.editingSlug, formData)
      : this.collectionService.createCollection(formData);

    operation.subscribe({
      next: () => {
        this.showSuccessMessage(this.isEdit ? 'Collection updated successfully!' : 'Collection created successfully!');
        this.resetForm();
        this.loadCollections();
      },
      error: (err) => {
        if (err.status === 400 && err.error.message) {
          this.showErrorMessage(err.error.message); // الرسالة من الباك اند
        } else {
          this.showErrorMessage(this.isEdit ? 'Failed to update collection' : 'Failed to create collection');
        }
      }


    });
  }

  editCollection(collection: Collection) {
    this.isEdit = true;
    this.isCreating = false;
    this.editingSlug = collection.collectionSlug;
    this.editingCollection = collection;
    this.form.patchValue({ collectionName: collection.collectionName });
  }

  promptDelete(slug: string) {
    this.currentSlug = slug;
    this.confirmAction = 'delete';
    this.confirmMessage = 'Are you sure you want to delete this collection?';
    this.showConfirmModal = true;
  }

  promptRestore(slug: string) {
    this.currentSlug = slug;
    this.confirmAction = 'restore';
    this.confirmMessage = 'Are you sure you want to restore this collection?';
    this.showConfirmModal = true;
  }

  confirmActionHandler() {
    if (!this.currentSlug || !this.confirmAction) return;

    this.showConfirmModal = false;
    this.showProgressMessage(this.confirmAction === 'delete' ? 'Deleting collection...' : 'Restoring collection...');

    const operation = this.confirmAction === 'delete'
      ? this.collectionService.deleteCollection(this.currentSlug)
      : this.collectionService.restoreCollection(this.currentSlug);

    operation.subscribe({
      next: () => {
        this.showSuccessMessage(this.confirmAction === 'delete' ? 'Collection deleted successfully!' : 'Collection restored successfully!');
        this.loadCollections();
      },
      error: () => {
        this.showErrorMessage(this.confirmAction === 'delete' ? 'Failed to delete collection' : 'Failed to restore collection');
      }
    });

    this.confirmAction = null;
    this.currentSlug = null;
  }

  resetForm() {
    this.form.reset();
    this.selectedImage = null;
    this.previewImage = null;
    this.isEdit = false;
    this.isCreating = false;
    this.editingSlug = null;
    this.editingCollection = null;
  }

  toggleDeletedView() {
    this.isDeletedView = !this.isDeletedView;
    this.page = 1;
    this.resetForm();
    this.loadCollections();
  }

  goToPage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadCollections();
    }
  }

  // Message handling methods
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