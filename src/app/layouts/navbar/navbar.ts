import { Component, AfterViewInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from '../footer/footer';
import { Home } from '../../features/landing/home/home';
import { About } from '../../features/landing/about/about';
import { Academics } from '../../features/landing/academics/academics';
import { Admissions } from '../../features/landing/admissions/admissions';
import { Gallery } from '../../features/landing/gallery/gallery';
import { NewsEvents } from '../../features/news-events/news-events';
import { Downloads } from '../../features/landing/downloads/downloads';
import { Faq } from '../../features/landing/faq/faq';
import { Contact } from '../../features/landing/contact/contact';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, Footer, Home, About, Academics, Admissions, Gallery, NewsEvents, Downloads, Faq, Contact],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements AfterViewInit {
  isMenuOpen = false;
  isScrolled = false;

  ngAfterViewInit(): void {
    this.setupLazyLoading();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.pageYOffset > 10;
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (this.isScrolled) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  private setupLazyLoading(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              const componentId = target.dataset['component'];
              
              if (componentId === 'news-events') {
                const newsEventsElement = document.querySelector('app-news-events');
                if (newsEventsElement && (newsEventsElement as any).loadContent) {
                  (newsEventsElement as any).loadContent();
                }
              } else if (componentId === 'downloads') {
                const downloadsElement = document.querySelector('app-downloads');
                if (downloadsElement && (downloadsElement as any).loadDownloads) {
                  (downloadsElement as any).loadDownloads();
                }
              }
              
              observer.unobserve(target);
            }
          });
        },
        { threshold: 0.1 }
      );

      // Observe sections that need lazy loading
      const newsSection = document.getElementById('news-events');
      const downloadsSection = document.getElementById('downloads');
      
      if (newsSection) {
        newsSection.dataset['component'] = 'news-events';
        observer.observe(newsSection);
      }
      
      if (downloadsSection) {
        downloadsSection.dataset['component'] = 'downloads';
        observer.observe(downloadsSection);
      }
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToSection(sectionId: string): void {
    this.isMenuOpen = false;
    
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 85;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      
      // Force scroll
      document.documentElement.scrollTop = offsetPosition;
      document.body.scrollTop = offsetPosition;
      window.scrollTo(0, offsetPosition);
    }
  }
}
