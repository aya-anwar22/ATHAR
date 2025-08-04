import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, ContactMessage } from '../../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  contactData: ContactMessage = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  success = false;
  error = '';

  constructor(private contactService: ContactService) {}

  submitForm(): void {
    if (!this.contactData.email || !this.contactData.message || !this.contactData.name) {
      this.error = 'Please fill all required fields.';
      return;
    }

    this.contactService.sendMessage(this.contactData).subscribe({
      next: () => {
        this.success = true;
        this.error = '';
        this.contactData = { name: '', email: '', subject: '', message: '' };
      },
      error: () => {
        this.error = 'Something went wrong. Please try again later.';
        this.success = false;
      }
    });
  }
}
