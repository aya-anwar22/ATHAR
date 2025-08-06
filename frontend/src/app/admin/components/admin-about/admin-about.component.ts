import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminAboutService } from '../../../core/services/admin-about.service';

@Component({
  standalone: true,
  selector: 'app-admin-about',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-about.component.html',
  styleUrls: ['./admin-about.component.scss']
})
export class AdminAboutComponent implements OnInit {
  aboutForm!: FormGroup;
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
  aboutData: any = null;
  isEditMode = false;
  isCreating = false;

  // Notification properties
  showMessage = false;
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  progressValue = 100;

  // Confirmation modal properties
  showConfirmModal = false;
  confirmMessage = '';
  private confirmAction: () => void = () => {};

  constructor(private fb: FormBuilder, private aboutService: AdminAboutService) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchAbout();
  }

  initForm(): void {
    this.aboutForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      bio: ['', [Validators.required, Validators.maxLength(2000)]],
      photo: [null]
    });
  }

  fetchAbout(): void {
    this.aboutService.getAbout().subscribe({
      next: (res) => {
        this.aboutData = res.about[0] || null;
        this.isCreating = false;
        this.isEditMode = false;
      },
      error: (err) => {
        this.showNotification('Error fetching about data', 'error');
      }
    });
  }

  showCreateForm(): void {
    this.isCreating = true;
    this.isEditMode = false;
    this.aboutForm.reset();
    this.selectedFile = null;
    this.previewImage = null;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submit(): void {
    if (this.aboutForm.invalid) {
      this.markFormGroupTouched(this.aboutForm);
      return;
    }

    const formData = new FormData();
    formData.append('title', this.aboutForm.get('title')?.value);
    formData.append('bio', this.aboutForm.get('bio')?.value);
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.showNotification('Saving about section...', 'info');

    const operation = this.isEditMode && this.aboutData
      ? this.aboutService.updateAbout(this.aboutData._id, formData)
      : this.aboutService.createAbout(formData);

    operation.subscribe({
      next: () => {
        this.showNotification('About section saved successfully!', 'success');
        this.fetchAbout();
        this.resetFormState();
      },
      error: (err) => {
        this.showNotification('Error saving about section', 'error');
      }
    });
  }

  enableEdit(): void {
    this.isEditMode = true;
    this.isCreating = false;
    this.aboutForm.patchValue({
      title: this.aboutData.title,
      bio: this.aboutData.bio
    });
    this.previewImage = this.aboutData.photoUrl;
  }

  cancelForm(): void {
    if (this.aboutForm.dirty || this.selectedFile) {
      this.confirmMessage = 'Are you sure you want to cancel? All unsaved changes will be lost.';
      this.confirmAction = () => {
        this.resetFormState();
        this.showConfirmModal = false;
      };
      this.showConfirmModal = true;
    } else {
      this.resetFormState();
    }
  }

  resetFormState(): void {
    this.aboutForm.reset();
    this.isEditMode = false;
    this.isCreating = false;
    this.selectedFile = null;
    this.previewImage = null;
  }

  // Notification methods
  showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;
    
    if (type === 'info') {
      this.progressValue = 100;
      const interval = setInterval(() => {
        this.progressValue -= 1;
        if (this.progressValue <= 0) {
          clearInterval(interval);
        }
      }, 50);
    }

    setTimeout(() => {
      this.hideMessage();
    }, 3000);
  }

  hideMessage(): void {
    this.showMessage = false;
  }

  // Confirmation modal methods
  confirmActionHandler(): void {
    this.confirmAction();
  }

  // Form helper
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}