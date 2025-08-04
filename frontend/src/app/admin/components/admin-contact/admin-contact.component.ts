import { Component, OnInit } from '@angular/core';
import { AdminContactService, ContactMessage } from '../../../core/services/admin-contact.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-contact.component.html'
})
export class AdminContactComponent implements OnInit {
  messages: ContactMessage[] = [];
  selectedMessageId: string | null = null;
  replyText: string = '';
  successMsg = '';
  errorMsg = '';

  constructor(private contactService: AdminContactService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.contactService.getMessages().subscribe({
      next: (data) => this.messages = data,
      error: () => this.errorMsg = 'Failed to load messages.'
    });
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
        this.loadMessages();
      },
      error: () => this.errorMsg = 'Error sending reply.'
    });
  }
}
