import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BackgroundImage {
  id: number;
  src: string;
}

import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-hero-background',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
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
      { id: 1, src: 'assets/images/hero/dj-1.webp' },
      { id: 2, src: 'assets/images/hero/dj-2.webp' },
      { id: 3, src: 'assets/images/hero/dj-3.webp' },
      { id: 4, src: 'assets/images/hero/dj-4.webp' },
      { id: 5, src: 'assets/images/hero/dj-5.webp' },
      { id: 6, src: 'assets/images/hero/dj-6.webp' },
      { id: 7, src: 'assets/images/hero/dj-7.webp' },
      { id: 8, src: 'assets/images/hero/dj-8.webp' },
      { id: 9, src: 'assets/images/hero/dj-9.webp' },
      { id: 10, src: 'assets/images/hero/dj-10.webp' },
      { id: 11, src: 'assets/images/hero/dj-11.webp' },
      { id: 12, src: 'assets/images/hero/dj-12.webp' },
      { id: 13, src: 'assets/images/hero/dj-13.webp' },
      { id: 14, src: 'assets/images/hero/dj-14.webp' },
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
        src: this.galleryImages[randomIndex].src
      });
    }
  }
}
