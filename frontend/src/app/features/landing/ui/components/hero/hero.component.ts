import { Component, OnInit, OnDestroy } from '@angular/core';
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
  currentSubtitleIndex: number = 0;
  subtitles: string[] = [];
  currentSubtitle: string = '';
  private destroy$ = new Subject<void>();
  private rotationInterval = 4000; // 4 seconds per subtitle

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.loadSubtitles();

    // Reload subtitles when language changes
    this.translateService.onLangChange.subscribe(() => {
      this.loadSubtitles();
    });
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
