import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileAdminService } from '../../../core/services/handle-profile-by-admin.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-handle-profile-by-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './handle-profile-by-admin.component.html',
  styleUrls: ['./handle-profile-by-admin.component.scss']
})
export class HandleProfileByAdminComponent implements OnInit {
  activeUsers: User[] = [];
  deletedUsers: User[] = [];

  totalUsers = 0;
  currentPage = 1;
  totalPages = 1;
  limit = 10;
  searchTerm = '';
  filterType: 'active' | 'deleted' = 'active';

  loading = false;
  errorMessage: string | null = null;

  editingUserId: string | null = null;
  newRole: string = '';

  constructor(private adminService: ProfileAdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  get users(): User[] {
    return this.filterType === 'deleted' ? this.deletedUsers : this.activeUsers;
  }

  loadUsers(): void {
    this.loading = true;
    const isDeleted = this.filterType === 'deleted';

    this.adminService.getUsers(this.currentPage, this.limit, isDeleted, this.searchTerm).subscribe({
      next: ({ users, total, totalPages }) => {
        if (isDeleted) {
          this.deletedUsers = users;
        } else {
          this.activeUsers = users;
        }
        this.totalUsers = total;
        this.totalPages = totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load users';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadUsers();
  }

  startEditRole(user: User): void {
    this.editingUserId = user._id;
    this.newRole = user.role;
  }

  cancelEdit(): void {
    this.editingUserId = null;
  }

  saveRole(userId: string): void {
    if (!this.newRole) return;

    this.adminService.updateUserRole(userId, this.newRole).subscribe({
      next: (updatedUser) => {
        const idx = this.users.findIndex(u => u._id === userId);
        if (idx !== -1) this.users[idx].role = updatedUser.role;
        this.editingUserId = null;
        alert('User role updated successfully');
      },
      error: (err) => {
        alert('Failed to update role');
        console.error(err);
      }
    });
  }

  confirmDelete(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          alert('User deleted successfully');
          this.loadUsers();
        },
        error: (err) => {
          alert('Failed to delete user');
          console.error(err);
        }
      });
    }
  }

 confirmRestore(userId: string): void {
  if (confirm('Are you sure you want to restore this user?')) {
    this.adminService.restoreUser(userId).subscribe({
      next: () => {
        alert('User restored successfully');
        this.loadUsers();
      },
      error: (err) => {
        alert('Failed to restore user');
        console.error(err);
      }
    });
  }
}

}
