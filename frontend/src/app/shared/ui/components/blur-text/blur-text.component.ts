import { Component, Input, ElementRef, OnChanges, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-blur-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [class]="className" class="blur-text-container">
      <span *ngFor="let word of words; let i = index" 
            class="word"
            [@blurAnimation]="{value: animationState, params: {delay: i * delay, duration: duration}}">
        {{ word }}&nbsp;
      </span>
    </p>
  `,
  styles: [`
    .blur-text-container {
      display: flex;
      flex-wrap: wrap;
      margin: 0;
    }
    .word {
      display: inline-block;
      will-change: transform, filter, opacity;
    }
  `],
  animations: [
    trigger('blurAnimation', [
      state('hidden', style({
        filter: 'blur(10px)',
        opacity: 0,
        transform: 'translate3d(0, -50px, 0)'
      })),
      state('visible', style({
        filter: 'blur(0px)',
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      })),
      transition('hidden => visible', [
        animate('{{duration}}ms {{delay}}ms cubic-bezier(0.2, 0.65, 0.3, 0.9)')
      ], { params: { delay: 0, duration: 1000 } })
    ])
  ]
})
export class BlurTextComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() text: string = '';
  @Input() className: string = '';
  @Input() delay: number = 200; // ms delay between words
  @Input() duration: number = 1000; // ms duration
  @Input() threshold: number = 0.1;

  words: string[] = [];
  animationState: 'hidden' | 'visible' = 'hidden';
  private observer: IntersectionObserver | undefined;

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) { }

  ngOnChanges() {
    this.words = this.text.split(' ');
    // Reset animation when text changes
    this.animationState = 'hidden';
    // If already in view, trigger animation again after a brief tick
    if (this.observer) {
      // Re-check intersection or just force trigger if we want it to replay
      setTimeout(() => {
        this.checkIntersection();
      }, 100);
    }
  }

  ngAfterViewInit() {
    this.checkIntersection();
  }

  private checkIntersection() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animationState = 'visible';
            this.cdr.detectChanges();
            if (this.observer) this.observer.disconnect();
          }
        });
      },
      { threshold: this.threshold }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
