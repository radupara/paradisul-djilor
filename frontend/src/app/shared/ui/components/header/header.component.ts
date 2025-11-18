import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../config/language/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentLanguage: string = 'en';

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

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  getLanguageLabel(): string {
    return this.currentLanguage === 'en' ? 'RO' : 'EN';
  }
}
