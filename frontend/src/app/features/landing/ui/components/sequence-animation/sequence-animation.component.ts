import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-sequence-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sequence-animation.component.html',
  styleUrl: './sequence-animation.component.scss'
})
export class SequenceAnimationComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private images: HTMLImageElement[] = [];
  private currentFrame = 0;
  private totalFrames = 280;
  private isLoading = true;
  private scrollTrigger: ScrollTrigger | null = null;

  ngOnInit() {
    setTimeout(() => {
      this.setupCanvas();
      this.loadImages();
      this.setupScrollAnimation();
    }, 100);
  }

  private setupCanvas() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas() {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      this.drawFrame();
    }
  }

  private loadImages() {
    const baseUrl = 'https://www.adaline.ai/sequence/16x9_281/high/graded_4K_100_gm_85_1440_3-';
    
    for (let i = 1; i <= this.totalFrames; i++) {
      const frameNumber = String(i).padStart(3, '0');
      const img = new Image();
      img.src = `${baseUrl}${frameNumber}.jpg`;
      img.onload = () => {
        this.images[i - 1] = img;
        
        if (this.images.length === 1) {
          this.isLoading = false;
          this.drawFrame();
        }
      };
    }
  }

  private setupScrollAnimation() {
    if (!this.canvas) return;

    const containerHeight = window.innerHeight * 3;

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.canvas.parentElement,
      start: 'top center',
      end: `+=${containerHeight}`,
      onUpdate: (self) => {
        const progress = Math.max(0, Math.min(self.progress, 1));
        this.currentFrame = Math.floor(progress * (this.totalFrames - 1));
        this.drawFrame();
      },
      scrub: 1,
      markers: false
    });
  }

  private drawFrame() {
    if (!this.ctx || this.images.length === 0) return;

    const frameIndex = Math.max(0, Math.min(this.currentFrame, this.images.length - 1));
    const image = this.images[frameIndex];

    if (!image) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const imgAspect = image.width / image.height;
    const canvasAspect = this.canvas.width / this.canvas.height;
    
    let drawWidth = this.canvas.width;
    let drawHeight = this.canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > canvasAspect) {
      drawHeight = this.canvas.width / imgAspect;
      offsetY = (this.canvas.height - drawHeight) / 2;
    } else {
      drawWidth = this.canvas.height * imgAspect;
      offsetX = (this.canvas.width - drawWidth) / 2;
    }

    this.ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  }

  ngOnDestroy() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
    window.removeEventListener('resize', () => this.resizeCanvas());
  }
}
