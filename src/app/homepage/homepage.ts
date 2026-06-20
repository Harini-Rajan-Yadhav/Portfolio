import { Component, signal, HostListener, effect, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
  host: { 'ngSkipHydration': 'true' }
})
export class Homepage {
  menuOpen = signal(false);
  activeSection = signal('home');
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  toggleMenu() {
    this.menuOpen.update(val => !val);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  navigateTo(section: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.activeSection.set(section);
    this.closeMenu();
    
    // Scroll to section smoothly (only on browser)
    if (this.isBrowser) {
      const element = document.getElementById(section);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
      }
    }
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if (!this.isBrowser) return;
    
    const sections = document.querySelectorAll('section[id]');
    let currentSection = 'home';

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentSection = section.id;
      }
    });

    this.activeSection.set(currentSection);
  }
}