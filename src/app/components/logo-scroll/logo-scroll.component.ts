import { Component, HostListener, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-logo-scroll',
  templateUrl: './logo-scroll.component.html',
  styleUrls: ['./logo-scroll.component.scss']
})
export class LogoScrollComponent implements OnInit {
  logos: string[] = [
    'https://usercontent.one/wp/shrigandha.nl/wp-content/themes/shrighanda_new/angular-app/assets/events/2026/logos/logo1.png',
    'https://usercontent.one/wp/shrigandha.nl/wp-content/themes/shrighanda_new/angular-app/assets/events/2026/logos/logo2.png',
    'https://usercontent.one/wp/shrigandha.nl/wp-content/themes/shrighanda_new/angular-app/assets/events/2026/logos/logo3.png',
    'https://usercontent.one/wp/shrigandha.nl/wp-content/themes/shrighanda_new/angular-app/assets/events/2026/logos/logo4.png',
    'https://usercontent.one/wp/shrigandha.nl/wp-content/themes/shrighanda_new/angular-app/assets/events/2026/logos/logo5.png',
    'https://usercontent.one/wp/shrigandha.nl/wp-content/themes/shrighanda_new/angular-app/assets/events/2026/logos/logo6.png',
    'https://usercontent.one/wp/shrigandha.nl/wp-content/themes/shrighanda_new/angular-app/assets/events/2026/logos/logo7.png',
    'https://usercontent.one/wp/shrigandha.nl/wp-content/themes/shrighanda_new/angular-app/assets/events/2026/logos/logo8.png',
    'https://usercontent.one/wp/shrigandha.nl/wp-content/themes/shrighanda_new/angular-app/assets/events/2026/logos/logo9.png'
    // add more as needed
  ];

  duplicatedLogos: string[] = [];

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    // duplicate array here for smooth scroll
    this.duplicatedLogos = [...this.logos, ...this.logos];
    this.setScrollSpeed();
  }

  @HostListener('window:resize')
  onResize() {
    this.setScrollSpeed();
  }

  setScrollSpeed() {
    const width = window.innerWidth;
    let speed = '30s';
    if (width < 768) speed = '50s';
    else if (width < 1200) speed = '40s';

    this.renderer.setStyle(this.el.nativeElement, '--scroll-speed', speed);
  }
}
