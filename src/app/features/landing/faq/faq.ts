import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {
  expandedItem: number | null = null;

  toggleItem(index: number): void {
    this.expandedItem = this.expandedItem === index ? null : index;
  }

  isExpanded(index: number): boolean {
    return this.expandedItem === index;
  }

  handleKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleItem(index);
    }
  }
}
