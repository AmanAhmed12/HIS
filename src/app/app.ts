import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layouts/navbar/navbar';
import { Home } from './features/landing/home/home';
import { About } from './features/landing/about/about';
import { Contact } from './features/landing/contact/contact';
import { Faq } from './features/landing/faq/faq';
import { Gallery } from './features/landing/gallery/gallery';
import { Footer } from './layouts/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Home, About, Contact, Faq, Gallery, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('HIS');
}
