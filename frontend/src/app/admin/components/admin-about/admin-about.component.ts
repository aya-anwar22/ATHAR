import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminAboutService } from '../../../core/services/admin-about.service';

@Component({
  standalone: true,
  selector: 'app-admin-about',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-about.component.html'
})
export class AdminAboutComponent implements OnInit {
  aboutForm!: FormGroup;
  selectedFile?: File;
  aboutData: any = null;
  isEditMode = false;

  constructor(private fb: FormBuilder, private aboutService: AdminAboutService) {}

  ngOnInit(): void {
    this.aboutForm = this.fb.group({
      title: [''],
      bio: [''],
      photo: [null]
    });

    this.fetchAbout();
  }

  fetchAbout(): void {
    this.aboutService.getAbout().subscribe(res => {
      this.aboutData = res.about[0] || null;
    });
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  submit(): void {
    const formData = new FormData();
    formData.append('title', this.aboutForm.get('title')?.value);
    formData.append('bio', this.aboutForm.get('bio')?.value);
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    if (this.isEditMode && this.aboutData) {
      this.aboutService.updateAbout(this.aboutData._id, formData).subscribe(() => {
        this.fetchAbout();
        this.isEditMode = false;
        this.aboutForm.reset();
        this.selectedFile = undefined;
      });
    } else {
      this.aboutService.createAbout(formData).subscribe(() => {
        this.fetchAbout();
        this.aboutForm.reset();
        this.selectedFile = undefined;
      });
    }
  }

  enableEdit(): void {
    this.isEditMode = true;
    this.aboutForm.patchValue({
      title: this.aboutData.title,
      bio: this.aboutData.bio
    });
  }
}
