import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BackgroundImage {
  id: number;
  src: string;
}

@Component({
  selector: 'app-hero-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-background.component.html',
  styleUrl: './hero-background.component.scss'
})
export class HeroBackgroundComponent implements OnInit {
  images: BackgroundImage[] = [];
  galleryImages: BackgroundImage[] = [];

  ngOnInit(): void {
    this.initializeGalleryImages();
    this.generateBackgroundGallery();
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
    const columnCount = 10; // Increased to match SCSS
    const rowCount = 5; // Increased to match SCSS
    const totalTiles = columnCount * rowCount;
    this.images = [];

    for (let i = 0; i < totalTiles; i++) {
      const randomIndex = Math.floor(Math.random() * this.galleryImages.length);
      this.images.push({
        id: i,
        src: this.galleryImages[randomIndex].src
      });
    }
  }
}
