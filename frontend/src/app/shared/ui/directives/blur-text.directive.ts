import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appBlurText]',
  standalone: true
})
export class BlurTextDirective implements OnInit {
  @Input() blur: number = 10;
  @Input() delay: number = 0;
  @Input() duration: number = 0.8;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const element = this.el.nativeElement;
    const animationName = `blur-text-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create keyframes
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes ${animationName} {
        0% {
          filter: blur(${this.blur}px);
          opacity: 0;
        }
        100% {
          filter: blur(0px);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    // Apply animation to element
    element.style.animation = `${animationName} ${this.duration}s ease-out ${this.delay}s forwards`;
  }
}
