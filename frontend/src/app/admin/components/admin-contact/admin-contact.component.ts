import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactMessage } from '../../../core/models/ContactMessage.model';
import { AdminContactService } from '../../../core/services/admin-contact.service';

@Component({
  selector: 'app-admin-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-contact.component.html',
  styleUrls: ['./admin-contact.component.scss']
})
export class AdminContactComponent implements OnInit {
  messages: ContactMessage[] = [];
  filteredMessages: ContactMessage[] = [];
  currentPage = 1;
  limit = 10;
  totalPages = 1;
  filterStatus: 'all' | 'replied' | 'pending' = 'all';

  selectedMessageId: string | null = null;
  replyText: string = '';
  successMsg = '';
  errorMsg = '';

  constructor(private contactService: AdminContactService) {}

  ngOnInit(): void {
    this.loadMessages(this.currentPage);
  }

  loadMessages(page: number = 1): void {
    this.contactService.getMessages(page, this.limit).subscribe({
      next: (data) => {
        this.messages = data.messages;
        this.filterMessages();
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
      },
      error: () => this.errorMsg = 'Failed to load messages.'
    });
  }

  setFilter(status: 'all' | 'replied' | 'pending'): void {
    this.filterStatus = status;
    this.filterMessages();
  }

  filterMessages(): void {
    switch (this.filterStatus) {
      case 'replied':
        this.filteredMessages = this.messages.filter(msg => msg.isReplyed);
        break;
      case 'pending':
        this.filteredMessages = this.messages.filter(msg => !msg.isReplyed);
        break;
      default:
        this.filteredMessages = [...this.messages];
    }
  }

  selectMessage(id: string): void {
    this.selectedMessageId = id;
    this.replyText = '';
    this.successMsg = '';
    this.errorMsg = '';
  }

  sendReply(): void {
    if (!this.replyText.trim() || !this.selectedMessageId) return;

    this.contactService.replyToMessage(this.selectedMessageId, this.replyText).subscribe({
      next: () => {
        this.successMsg = 'Reply sent successfully!';
        this.selectedMessageId = null;
        this.replyText = '';
        this.loadMessages(this.currentPage);
      },
      error: () => this.errorMsg = 'Error sending reply.'
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadMessages(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }
}