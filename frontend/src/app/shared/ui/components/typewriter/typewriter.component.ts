import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-typewriter',
    standalone: true,
    imports: [CommonModule],
    template: `
    <span class="typewriter-text">{{ displayedText }}<span class="cursor" [class.blinking]="isCursorBlinking">|</span></span>
  `,
    styles: [`
    .typewriter-text {
      display: inline-block;
      white-space: pre-wrap;
    }
    .cursor {
      display: inline-block;
      margin-left: 2px;
      font-weight: 100;
      opacity: 1;
    }
    .cursor.blinking {
      animation: blink 1s step-end infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `]
})
export class TypewriterComponent implements OnInit, OnChanges {
    @Input() text: string = '';
    @Input() speed: number = 50; // ms per char
    @Input() delay: number = 0; // ms before starting
    @Input() showCursor: boolean = true;

    displayedText: string = '';
    isCursorBlinking: boolean = true;
    private timeoutId: any;

    ngOnInit() {
        this.startEffect();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['text'] && !changes['text'].firstChange) {
            this.startEffect();
        }
    }

    private startEffect() {
        clearTimeout(this.timeoutId);
        this.displayedText = '';
        this.isCursorBlinking = true;

        if (this.delay > 0) {
            this.timeoutId = setTimeout(() => this.type(), this.delay);
        } else {
            this.type();
        }
    }

    private type() {
        const fullText = this.text || '';
        let currentIndex = 0;

        const typeChar = () => {
            if (currentIndex < fullText.length) {
                this.displayedText += fullText.charAt(currentIndex);
                currentIndex++;
                this.timeoutId = setTimeout(typeChar, this.speed);
            } else {
                // Finished typing
                if (!this.showCursor) {
                    this.isCursorBlinking = false;
                }
            }
        };

        typeChar();
    }
}
