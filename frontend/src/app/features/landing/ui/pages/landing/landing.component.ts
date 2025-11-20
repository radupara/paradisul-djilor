import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { ZoomScrollComponent } from '../../components/zoom-scroll/zoom-scroll.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, TranslateModule, HeroComponent, ZoomScrollComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
}
