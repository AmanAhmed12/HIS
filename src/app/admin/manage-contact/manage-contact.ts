import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../features/contact/contact.service';
import { ContactMessage } from '../../shared/models';

@Component({
  selector: 'app-manage-contact',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manage-contact.html',
  styleUrl: './manage-contact.css'
})
export class ManageContact implements OnInit {
  private contactService = inject(ContactService);

  contactList = signal<ContactMessage[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  selectedMessage = signal<ContactMessage | null>(null);

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.isLoading.set(true);
    this.contactService.getAll().subscribe({
      next: (res) => {
        this.contactList.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load contact messages. Ensure the Spring Boot API is running.');
        this.isLoading.set(false);
      }
    });
  }

  viewMessage(message: ContactMessage): void {
    this.selectedMessage.set(message);
    if (!message.isRead) {
      this.markAsRead(message);
    }
  }

  closeMessage(): void {
    this.selectedMessage.set(null);
  }

  markAsRead(message: ContactMessage): void {
    this.contactService.markAsRead(message.id!).subscribe({
      next: () => {
        message.isRead = true;
        this.successMessage.set('Marked as read');
        setTimeout(() => this.successMessage.set(null), 2000);
      },
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }

  deleteMessage(message: ContactMessage): void {
    if (!confirm(`Delete message from "${message.name}"?`)) return;
    this.contactService.delete(message.id!).subscribe({
      next: () => {
        this.successMessage.set('Message deleted successfully.');
        this.selectedMessage.set(null);
        this.loadMessages();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

