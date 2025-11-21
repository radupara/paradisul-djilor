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
  private preloadingQueue: Set<number> = new Set();
  private loadedFrames: Set<number> = new Set();
  private preloadWindow: number = 10;

  constructor() { }

  ngOnInit(): void {
    this.preloadInitialFrames();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupCanvas();
      this.initializeAnimation();
    }, 100);
  }

  private preloadInitialFrames(): void {
    for (let i = 1; i <= Math.min(this.preloadWindow * 2, this.totalFrames); i++) {
      this.preloadFrame(i);
    }
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        this.loadAndDrawFirstFrame();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  private loadAndDrawFirstFrame(): void {
    const img = new Image();
    const url = this.getImageUrl(1);
    img.src = url;
    img.onload = () => {
      this.imageCache.set(1, img);
      this.loadedFrames.add(1);
      this.drawFrame(1);
    };
  }

  private preloadFrame(frameNum: number): void {
    const validFrameNum = Math.max(1, Math.min(frameNum, this.totalFrames));

    if (this.loadedFrames.has(validFrameNum) || this.preloadingQueue.has(validFrameNum)) {
      return;
    }

    this.preloadingQueue.add(validFrameNum);
    const img = new Image();
    const url = this.getImageUrl(validFrameNum);
    img.src = url;
    img.onload = () => {
      this.imageCache.set(validFrameNum, img);
      this.loadedFrames.add(validFrameNum);
      this.preloadingQueue.delete(validFrameNum);
    };
    img.onerror = () => {
      this.preloadingQueue.delete(validFrameNum);
    };
  }

  private getImageUrl(frameNum: number): string {
    const paddedNum = String(frameNum).padStart(3, '0');
    return `assets/images/frames/frame-${paddedNum}.png`;
  }

  private initializeAnimation(): void {
    if (!this.zoomScrollSection || !this.ctx) return;

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.zoomScrollSection.nativeElement,
      start: 'top top',
      end: 'bottom bottom',
      anticipatePin: 1,
      onUpdate: (self: any) => {
        const progress = self.progress;
        const frameNum = Math.ceil(progress * (this.totalFrames - 1)) + 1;
        this.currentFrameIndex = frameNum;

        this.updateFramePreloading(frameNum);
        this.drawFrame(frameNum);
      }
    });
  }

  private updateFramePreloading(currentFrame: number): void {
    const startFrame = Math.max(1, currentFrame - this.preloadWindow);
    const endFrame = Math.min(this.totalFrames, currentFrame + this.preloadWindow);

    for (let i = startFrame; i <= endFrame; i++) {
      if (!this.loadedFrames.has(i) && !this.preloadingQueue.has(i)) {
        this.preloadFrame(i);
      }
    }
  }

  private drawFrame(frameNum: number): void {
    if (!this.ctx || !this.canvasRef) return;

    const validFrameNum = Math.max(1, Math.min(frameNum, this.totalFrames));
    const canvas = this.canvasRef.nativeElement;

    const img = this.imageCache.get(validFrameNum);

    if (!img || !img.complete || img.naturalWidth === 0) {
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

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

    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  ngOnDestroy(): void {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
    ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
    this.imageCache.clear();
  }
}
