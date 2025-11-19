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
      { id: 1, src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop' },
      { id: 2, src: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=300&fit=crop' },
      { id: 3, src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop' },
      { id: 4, src: 'https://images.unsplash.com/photo-1520974957348-6c8b3c56fae9?w=400&h=300&fit=crop' },
      { id: 5, src: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop' },
      { id: 6, src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop' },
      { id: 7, src: 'https://images.unsplash.com/photo-1478225143920-732262203ce8?w=400&h=300&fit=crop' },
      { id: 8, src: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400&h=300&fit=crop' },
      { id: 9, src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop' },
      { id: 10, src: 'https://images.unsplash.com/photo-1504521170335-48b3c1f0f88d?w=400&h=300&fit=crop' },
      { id: 11, src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop' },
      { id: 12, src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop' },
      { id: 13, src: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=300&fit=crop' },
      { id: 14, src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop' }
    ];
  }

  private generateBackgroundGallery(): void {
    const columnCount = 4;
    const rowCount = 3;
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
