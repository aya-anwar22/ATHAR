import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../core/services/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  loading = false;
  errorMessage: string | null = null;

  isEditMode = false;
  editableProfile: UserProfile | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        console.log('data', JSON.stringify(data, null, 2));
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load profile.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  enterEditMode(): void {
    if (this.profile) {
      this.editableProfile = JSON.parse(JSON.stringify(this.profile));
      this.isEditMode = true;
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editableProfile = null;
  }

  updateProfile(): void {
    if (!this.editableProfile) return;
    this.loading = true;
    this.profileService.updateProfile(this.editableProfile).subscribe({
      next: (data) => {
        this.profile = data;
        this.isEditMode = false;
        this.editableProfile = null;
        this.loading = false;
        alert('Profile updated successfully.');
      },
      error: (err) => {
        this.errorMessage = 'Failed to update profile.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your account?!')) {
      this.profileService.deleteProfile().subscribe({
        next: () => {
          alert('Account deleted successfully.');
          this.profile = null;
          this.isEditMode = false;
        },
        error: (err) => {
          alert('Failed to delete account');
          console.error(err);
        }
      });
    }
  }
}
