import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-zoom-scroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zoom-scroll.component.html',
  styleUrl: './zoom-scroll.component.scss'
})
export class ZoomScrollComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('zoomScrollSection') zoomScrollSection!: ElementRef<HTMLDivElement>;

  currentFrameIndex: number = 0;
  totalFrames: number = 280;
  private ctx: CanvasRenderingContext2D | null = null;
  private imageCache: Map<number, HTMLImageElement> = new Map();
  private scrollTrigger: any;
  private animationFrameId: number | null = null;
  private preloadedFrames: Set<number> = new Set();

  constructor() {}

  ngOnInit(): void {
    this.preloadAllFrames();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupCanvas();
      this.initializeAnimation();
    }, 100);
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        this.drawFrame(1);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  private preloadAllFrames(): void {
    // Preload all frames for smooth playback without stuttering
    for (let i = 1; i <= this.totalFrames; i++) {
      this.preloadFrame(i);
    }
  }

  private preloadFrame(frameNum: number): void {
    const validFrameNum = Math.max(1, Math.min(frameNum, this.totalFrames));
    
    if (this.preloadedFrames.has(validFrameNum)) return;
    
    const img = new Image();
    const url = this.getImageUrl(validFrameNum);
    img.src = url;
    img.onload = () => {
      this.imageCache.set(validFrameNum, img);
      this.preloadedFrames.add(validFrameNum);
    };
    img.onerror = () => {
      console.error(`Failed to preload frame ${validFrameNum}`);
    };
  }

  private getImageUrl(frameNum: number): string {
    const paddedNum = String(frameNum).padStart(3, '0');
    return `https://www.adaline.ai/sequence/16x9_281/high/graded_4K_100_gm_85_1440_3-${paddedNum}.jpg`;
  }

  private initializeAnimation(): void {
    if (!this.zoomScrollSection || !this.ctx) return;

    // Disable smooth scroll during animation
    document.documentElement.style.scrollBehavior = 'auto';

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.zoomScrollSection.nativeElement,
      start: 'top top',
      end: 'bottom bottom',
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const frameNum = Math.ceil(progress * (this.totalFrames - 1)) + 1;
        this.currentFrameIndex = frameNum;

        // Draw frame immediately from cache (should be preloaded)
        this.drawFrame(frameNum);
      }
    });
  }

  private loadAndDrawFrame(frameNum: number): void {
    const validFrameNum = Math.max(1, Math.min(frameNum, this.totalFrames));

    // If cached, draw immediately
    if (this.imageCache.has(validFrameNum)) {
      const img = this.imageCache.get(validFrameNum);
      if (img) {
        this.drawFrame(img);
      }
      return;
    }

    // Load frame asynchronously
    const img = new Image();
    const url = this.getImageUrl(validFrameNum);
    img.src = url;
    img.onload = () => {
      this.imageCache.set(validFrameNum, img);
      if (this.currentFrameIndex === validFrameNum) {
        this.drawFrame(img);
      }
    };
    img.onerror = () => {
      console.error(`Failed to load frame ${validFrameNum}`);
    };
  }

  private drawFrame(frameOrNum: HTMLImageElement | number): void {
    if (!this.ctx || !this.canvasRef) return;

    const canvas = this.canvasRef.nativeElement;
    let img: HTMLImageElement | null = null;

    if (typeof frameOrNum === 'number') {
      img = this.imageCache.get(frameOrNum) || null;
    } else {
      img = frameOrNum;
    }

    if (!img || !img.complete || img.naturalWidth === 0) {
      // If image not ready, draw placeholder
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Clear canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions to maintain aspect ratio
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > canvasAspect) {
      drawWidth = canvas.height * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2;
    } else {
      drawHeight = canvas.width / imgAspect;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  ngOnDestroy(): void {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    document.documentElement.style.scrollBehavior = '';
  }
}
