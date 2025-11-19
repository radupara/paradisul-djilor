import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BlurTextComponent } from '../../../../../shared/ui/components/blur-text/blur-text.component';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TranslateModule, BlurTextComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  currentSubtitleIndex: number = 0;
  subtitles: string[] = [];
  currentSubtitle: string = '';
  private destroy$ = new Subject<void>();
  private rotationInterval = 4000; // 4 seconds per subtitle

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.loadSubtitles();
    this.ensureVideoPlayback();

    // Reload subtitles when language changes
    this.translateService.onLangChange.subscribe(() => {
      this.loadSubtitles();
    });
  }

  private ensureVideoPlayback(): void {
    if (this.heroVideo && this.heroVideo.nativeElement) {
      const video = this.heroVideo.nativeElement;

      // Wait for video metadata to be loaded
      const playVideo = () => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Video is playing
            })
            .catch((error) => {
              // Autoplay prevented - add click handler for user interaction
              console.log('Video autoplay prevented. Click anywhere to play.');
              document.addEventListener('click', () => {
                video.play().catch(err => console.log('Play error:', err));
              }, { once: true });
            });
        }
      };

      if (video.readyState >= 2) {
        // Video metadata is already loaded
        playVideo();
      } else {
        // Wait for metadata to load
        video.addEventListener('loadedmetadata', playVideo, { once: true });
      }
    }
  }

  private loadSubtitles(): void {
    this.translateService.get('landing.hero.subtitles').subscribe((subtitles: any) => {
      if (Array.isArray(subtitles)) {
        this.subtitles = subtitles;
        this.currentSubtitleIndex = 0;
        this.currentSubtitle = this.subtitles[0];
        this.startSubtitleRotation();
      }
    });
  }

  private startSubtitleRotation(): void {
    // Clear previous subscription
    this.destroy$.next();

    interval(this.rotationInterval)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentSubtitleIndex = (this.currentSubtitleIndex + 1) % this.subtitles.length;
        this.currentSubtitle = this.subtitles[this.currentSubtitleIndex];
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
