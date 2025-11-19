import { Component, Input, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blur-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blur-text.component.html',
  styleUrl: './blur-text.component.scss'
})
export class BlurTextComponent implements OnInit, OnChanges {
  @Input() text: string = '';
  @Input() delay: number = 200;
  @Input() className: string = '';
  @Input() stepDuration: number = 0.35;

  @ViewChild('blurTextRef') blurTextRef!: ElementRef;

  words: Array<{ text: string; index: number; style: any }> = [];
  inView: boolean = true;

  ngOnInit(): void {
    this.initializeAnimation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] && !changes['text'].firstChange) {
      this.initializeAnimation();
    }
  }

  private initializeAnimation(): void {
    const elements = this.text.split(' ');
    this.words = elements.map((word, index) => ({
      text: word,
      index,
      style: this.getWordStyle(index)
    }));
  }

  private getWordStyle(index: number): any {
    const animationDelay = (index * this.delay) / 1000;
    const totalDuration = this.stepDuration * 2;

    return {
      animation: `blurTextAnimation ${totalDuration}s ease-out ${animationDelay}s forwards`,
      filter: 'blur(10px)',
      opacity: 0
    };
  }
}
