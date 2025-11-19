import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../config/language/language.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'en';
  isScrolled: boolean = false;
  isHovered: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private languageService: LanguageService,
    private translateService: TranslateService
  ) {
    this.currentLanguage = this.languageService.getCurrentLanguage();

    // Subscribe to language changes
    this.translateService.onLangChange.subscribe(() => {
      this.currentLanguage = this.languageService.getCurrentLanguage();
    });
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll.bind(this));
    this.destroy$.next();
    this.destroy$.complete();
  }

  private onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  onHeaderHover(hovered: boolean): void {
    this.isHovered = hovered;
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  getLanguageLabel(): string {
    return this.currentLanguage === 'en' ? 'RO' : 'EN';
  }

  get shouldShowWhiteBackground(): boolean {
    return this.isScrolled || this.isHovered;
  }
}
