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
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('zoomScrollSection') zoomScrollSection!: ElementRef<HTMLDivElement>;

  currentFrameIndex: number = 0;
  totalFrames: number = 280;
  imageLoaded: boolean = false;
  imageUrl: string = '';
  isAnimating: boolean = false;
  private scrollTrigger: any;
  private originalScrollBehavior: string = '';
  private imageCache: Map<number, string> = new Map();
  private preloadedFrames: Set<number> = new Set();

  constructor() {}

  ngOnInit(): void {
    this.preloadKeyFrames();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeAnimation();
      this.loadFrame(1);
    }, 100);
  }

  private preloadKeyFrames(): void {
    // Preload first, middle, and last frames for better performance
    const framesToPreload = [1, Math.floor(this.totalFrames / 4), Math.floor(this.totalFrames / 2), Math.floor((this.totalFrames * 3) / 4), this.totalFrames];
    framesToPreload.forEach(frameNum => {
      this.preloadFrame(frameNum);
    });
  }

  private preloadFrame(frameNum: number): void {
    // Ensure frame number is valid (1-280)
    const validFrameNum = Math.max(1, Math.min(frameNum, this.totalFrames));

    if (this.preloadedFrames.has(validFrameNum)) return;

    const img = new Image();
    const url = this.getImageUrl(validFrameNum);
    img.src = url;
    img.onload = () => {
      this.imageCache.set(validFrameNum, url);
      this.preloadedFrames.add(validFrameNum);
    };
    img.onerror = () => {
      console.warn(`Failed to preload frame ${validFrameNum} from ${url}`);
    };
  }

  private initializeAnimation(): void {
    if (!this.imageContainer || !this.zoomScrollSection) return;

    this.isAnimating = true;
    this.originalScrollBehavior = document.documentElement.style.scrollBehavior;

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.zoomScrollSection.nativeElement,
      start: 'top center',
      end: 'bottom center',
      pin: false,
      onUpdate: (self) => {
        // Calculate frame from 0-100% progress, mapping to frames 1-280
        const progress = self.progress;
        const frameNum = Math.ceil(progress * (this.totalFrames - 1)) + 1;
        this.loadFrame(frameNum);

        // Check if animation is complete
        if (progress >= 0.99) {
          this.enableScroll();
          this.isAnimating = false;
        } else if (progress > 0 && progress < 0.99) {
          this.disableScroll();
        }
      },
      onLeaveBack: () => {
        this.enableScroll();
        this.isAnimating = false;
      }
    });
  }

  private loadFrame(frameNum: number): void {
    const validFrameNum = Math.max(1, Math.min(frameNum, this.totalFrames));

    if (validFrameNum === this.currentFrameIndex) return;

    this.currentFrameIndex = validFrameNum;

    // Load frame immediately if cached, otherwise load asynchronously
    if (this.imageCache.has(this.currentFrameIndex)) {
      this.imageUrl = this.imageCache.get(this.currentFrameIndex) || '';
      this.imageLoaded = true;
    } else {
      const url = this.getImageUrl(this.currentFrameIndex);
      this.imageUrl = url;
      this.imageLoaded = false;

      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (this.currentFrameIndex === validFrameNum) {
          this.imageCache.set(validFrameNum, url);
          this.imageLoaded = true;
        }
      };
      img.onerror = () => {
        console.error(`Failed to load frame ${validFrameNum} from URL: ${url}`);
      };
    }

    // Preload adjacent frames for smoother playback
    if (this.currentFrameIndex < this.totalFrames) {
      this.preloadFrame(this.currentFrameIndex + 1);
    }
    if (this.currentFrameIndex > 1) {
      this.preloadFrame(this.currentFrameIndex - 1);
    }
  }

  private getImageUrl(frameNum: number): string {
    const paddedNum = String(frameNum).padStart(3, '0');
    return `https://www.adaline.ai/sequence/16x9_281/high/graded_4K_100_gm_85_1440_3-${paddedNum}.jpg`;
  }

  private disableScroll(): void {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.scrollBehavior = 'auto';
  }

  private enableScroll(): void {
    document.body.style.overflow = '';
    document.documentElement.style.scrollBehavior = this.originalScrollBehavior;
  }

  ngOnDestroy(): void {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    this.enableScroll();
  }
}
