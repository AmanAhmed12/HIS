import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from './news.service';

@Component({
  selector: 'app-news-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-events.html',
  styleUrl: './news-events.css'
})
export class NewsEvents {
  newsItems: any[] = [];
  events: any[] = [];
  loading = true;
  hasLoaded = false;

  constructor(private newsService: NewsService) {}

  loadContent() {
    if (this.hasLoaded) return;
    this.hasLoaded = true;

    // For now, use mock data - will be replaced with API calls
    this.newsItems = [
      {
        id: 1,
        title: 'HIS Wins National Science Competition',
        date: '2024-06-15',
        category: 'Achievement',
        image: '/images/news1.jpg',
        excerpt: 'Our students secured first place in the National Science Competition with their innovative project on renewable energy.',
        content: 'Our students secured first place in the National Science Competition with their innovative project on renewable energy. The team of five students from grades 10-12 developed a prototype for a solar-powered water purification system.'
      },
      {
        id: 2,
        title: 'New Sports Complex Inauguration',
        date: '2024-05-20',
        category: 'Facilities',
        image: '/images/news2.jpg',
        excerpt: 'We are excited to announce the opening of our new sports complex, featuring a swimming pool, basketball court, and gym.',
        content: 'We are excited to announce the opening of our new sports complex, featuring a swimming pool, basketball court, and gym. This state-of-the-art facility will provide our students with opportunities for physical development and athletic excellence.'
      },
      {
        id: 3,
        title: 'International Day Celebration',
        date: '2024-04-10',
        category: 'Events',
        image: '/images/news3.jpg',
        excerpt: 'Students celebrated cultural diversity through performances, food, and exhibitions from around the world.',
        content: 'Students celebrated cultural diversity through performances, food, and exhibitions from around the world. The event showcased the rich heritage of our international community.'
      }
    ];

    this.events = [
      {
        id: 1,
        title: 'Annual Sports Day',
        date: '2024-07-15',
        time: '8:00 AM - 4:00 PM',
        location: 'School Grounds',
        description: 'Join us for our annual sports day featuring track and field events, games, and competitions.'
      },
      {
        id: 2,
        title: 'Parent-Teacher Conference',
        date: '2024-07-20',
        time: '9:00 AM - 12:00 PM',
        location: 'School Auditorium',
        description: 'Meet with teachers to discuss student progress and academic goals.'
      },
      {
        id: 3,
        title: 'Science Fair',
        date: '2024-08-05',
        time: '10:00 AM - 2:00 PM',
        location: 'School Hall',
        description: 'Students showcase their science projects and research findings.'
      }
    ];

    this.loading = false;
  }
}
