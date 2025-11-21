import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BackgroundImage {
  id: number;
  src: string;
  loaded?: boolean;
}

@Component({
  selector: 'app-hero-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-background.component.html',
  styleUrl: './hero-background.component.scss'
})
export class HeroBackgroundComponent implements OnInit, OnDestroy {
  images: BackgroundImage[] = [];
  galleryImages: BackgroundImage[] = [];
  private intersectionObserver: IntersectionObserver | null = null;

  ngOnInit(): void {
    this.initializeGalleryImages();
    this.generateBackgroundGallery();
    this.setupIntersectionObserver();
  }

  private initializeGalleryImages(): void {
    this.galleryImages = [
      { id: 1, src: 'assets/images/hero/dj-1.png' },
      { id: 2, src: 'assets/images/hero/dj-2.png' },
      { id: 3, src: 'assets/images/hero/dj-3.png' },
      { id: 4, src: 'assets/images/hero/dj-4.png' },
      { id: 5, src: 'assets/images/hero/dj-5.png' },
      { id: 6, src: 'assets/images/hero/dj-6.png' },
      { id: 7, src: 'assets/images/hero/dj-7.png' },
      { id: 8, src: 'assets/images/hero/dj-8.png' },
      { id: 9, src: 'assets/images/hero/dj-9.png' },
      { id: 10, src: 'assets/images/hero/dj-10.png' },
      { id: 11, src: 'assets/images/hero/dj-11.png' },
      { id: 12, src: 'assets/images/hero/dj-12.png' },
      { id: 13, src: 'assets/images/hero/dj-13.png' },
      { id: 14, src: 'assets/images/hero/dj-14.png' },
    ];
  }

  private generateBackgroundGallery(): void {
    const columnCount = 8;
    const rowCount = 4;
    const totalTiles = columnCount * rowCount;
    this.images = [];

    for (let i = 0; i < totalTiles; i++) {
      const randomIndex = Math.floor(Math.random() * this.galleryImages.length);
      this.images.push({
        id: i,
        src: this.galleryImages[randomIndex].src,
        loaded: false
      });
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const imageId = parseInt(img.getAttribute('data-id') || '0', 10);
          const imageIndex = this.images.findIndex(img => img.id === imageId);
          
          if (imageIndex !== -1 && !this.images[imageIndex].loaded) {
            this.images[imageIndex].loaded = true;
            img.src = this.images[imageIndex].src;
            this.intersectionObserver?.unobserve(entry.target);
          }
        }
      });
    }, options);
  }

  onImageInit(img: HTMLImageElement, imageId: number): void {
    img.setAttribute('data-id', imageId.toString());
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(img);
    }
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}
