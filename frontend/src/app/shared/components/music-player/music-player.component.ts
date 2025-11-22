import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-music-player',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './music-player.component.html',
    styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

    isPlaying = false;
    hasStarted = false;
    audioSource = 'assets/audio/background-music.mp3';

    private interactionListener: ((event: Event) => void) | null = null;
    private fadeInterval: any = null;
    private readonly TARGET_VOLUME = 0.5;
    private readonly FADE_DURATION = 10000; // 10 seconds
    private readonly FADE_STEPS = 100; // Number of updates
    private isAttemptingPlay = false;

    constructor(private ngZone: NgZone) { }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        const player = this.audioPlayerRef.nativeElement;
        player.volume = 0; // Start at 0 for fade-in
        player.preload = 'auto'; // Preload the audio

        // We use NgZone to run outside Angular to avoid triggering change detection on every event
        this.ngZone.runOutsideAngular(() => {
            this.interactionListener = this.tryAutoPlay.bind(this);
            // Listen to multiple events to catch the first user interaction
            // Use capture: true to ensure we catch the event even if propagation is stopped
            // We don't use 'once: true' because if the first attempt fails (e.g. browser blocks it),
            // we want to keep trying on subsequent events until it succeeds.
            // Priority order: wheel (mouse scroll) is most reliable for Chrome autoplay policy,
            // then other direct interactions, then scroll events
            // Note: 'wheel' events are more reliable than 'scroll' for Chrome's autoplay policy
            const events = [
                'wheel',           // Mouse wheel - most reliable for scroll-triggered autoplay
                'click', 
                'touchstart', 
                'keydown', 
                'mousedown', 
                'pointerdown', 
                'pointermove', 
                'scroll',          // Fallback for scroll events
                'touchmove', 
                'focus'
            ];
            // Add listeners to both window and document for better coverage
            const targets = [window, document, document.body].filter(Boolean);
            events.forEach(event => {
                // For wheel events, use non-passive listeners to maintain user gesture context in Chrome
                // Other events can be passive for better performance
                const isWheelEvent = event === 'wheel';
                targets.forEach(target => {
                    target.addEventListener(event, this.interactionListener!, { 
                        capture: true, 
                        passive: !isWheelEvent 
                    });
                });
            });
        });
    }

    ngOnDestroy(): void {
        this.removeListeners();
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
        }
    }

    togglePlay(): void {
        const player = this.audioPlayerRef.nativeElement;

        if (this.isPlaying) {
            player.pause();
            this.isPlaying = false;
            this.isAttemptingPlay = false; // Reset flag when manually paused
            // If paused during fade, we might want to stop fading or just leave it. 
            // For simplicity, we stop fading if they manually pause.
            if (this.fadeInterval) clearInterval(this.fadeInterval);
        } else {
            // When manually playing, ensure volume is set correctly
            // If it's already started before, we might need to reset volume for fade-in
            if (player.volume === 0 && this.hasStarted) {
                // Reset volume to 0 to restart fade-in
                player.volume = 0;
            }
            this.startPlayback(player);
        }
    }

    onEnded(): void {
        this.isPlaying = false;
        if (this.fadeInterval) clearInterval(this.fadeInterval);
    }

    private tryAutoPlay(event: Event): void {
        if (this.hasStarted || this.isAttemptingPlay) return;

        // If the interaction is on the play button, let the button's own handler manage it
        // to avoid race conditions or double-toggles.
        const target = event.target as HTMLElement;
        if (target && target.closest && target.closest('.player-btn')) {
            return;
        }

        const player = this.audioPlayerRef.nativeElement;
        const eventType = event.type;
        
        // Ensure volume is at 0 for fade-in
        if (player.volume > 0) {
            player.volume = 0;
        }
        
        // For wheel and scroll events, Chrome requires play() to be called synchronously
        // within the event handler to maintain the user gesture context
        const isScrollEvent = eventType === 'wheel' || eventType === 'scroll';
        
        // Ensure audio is loaded and ready before attempting to play
        if (player.readyState < 2) {
            // If not loaded enough, wait for canplay event
            const canPlayHandler = () => {
                player.removeEventListener('canplay', canPlayHandler);
                if (isScrollEvent) {
                    // For scroll events, try synchronous play first
                    this.trySynchronousPlay(player);
                } else {
                    this.startPlayback(player).catch((err) => {
                        // console.log('Autoplay blocked on ' + event.type, err);
                        this.isAttemptingPlay = false; // Reset flag on failure
                    });
                }
            };
            player.addEventListener('canplay', canPlayHandler);
            player.load(); // Trigger loading if not already started
        } else {
            if (isScrollEvent) {
                // For scroll events, try synchronous play to maintain user gesture context
                this.trySynchronousPlay(player);
            } else {
                this.startPlayback(player).catch((err) => {
                    // console.log('Autoplay blocked on ' + event.type, err);
                    this.isAttemptingPlay = false; // Reset flag on failure
                });
            }
        }
    }

    private trySynchronousPlay(player: HTMLAudioElement): void {
        if (this.isAttemptingPlay) return;
        this.isAttemptingPlay = true;

        // Try to play synchronously to maintain user gesture context for Chrome
        // This is important for scroll/wheel events
        const playPromise = player.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Playback started successfully
                    this.ngZone.run(() => {
                        this.isPlaying = true;
                        this.hasStarted = true;
                    });
                    this.removeListeners();
                    this.startFadeIn(player);
                })
                .catch((error) => {
                    // Playback was blocked
                    this.isAttemptingPlay = false;
                    // console.log('Autoplay blocked:', error);
                });
        } else {
            // Fallback for older browsers
            this.isAttemptingPlay = false;
            this.startPlayback(player).catch((err) => {
                this.isAttemptingPlay = false;
            });
        }
    }

    private async startPlayback(player: HTMLAudioElement): Promise<void> {
        if (this.isAttemptingPlay) return;
        this.isAttemptingPlay = true;

        try {
            // Ensure volume starts at 0 for fade-in (important for Firefox)
            player.volume = 0;

            await player.play();
            // console.log('Playback started successfully');

            this.ngZone.run(() => {
                this.isPlaying = true;
                this.hasStarted = true;
            });

            this.removeListeners();
            // Start fade-in immediately after successful play
            this.startFadeIn(player);

        } catch (error) {
            this.isAttemptingPlay = false;
            throw error;
        }
    }
    private startFadeIn(player: HTMLAudioElement): void {
        // Clear any existing fade interval
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
        }

        // If already at target volume, do nothing
        if (player.volume >= this.TARGET_VOLUME) {
            player.volume = this.TARGET_VOLUME;
            return;
        }

        // Ensure we start from 0
        player.volume = 0;

        const stepTime = this.FADE_DURATION / this.FADE_STEPS;
        const volumeStep = this.TARGET_VOLUME / this.FADE_STEPS;

        this.ngZone.runOutsideAngular(() => {
            this.fadeInterval = setInterval(() => {
                if (!this.isPlaying || player.paused) {
                    clearInterval(this.fadeInterval);
                    this.fadeInterval = null;
                    return;
                }

                const newVolume = Math.min(player.volume + volumeStep, this.TARGET_VOLUME);
                player.volume = newVolume;

                if (newVolume >= this.TARGET_VOLUME) {
                    clearInterval(this.fadeInterval);
                    this.fadeInterval = null;
                }
            }, stepTime);
        });
    }

    private removeListeners(): void {
        if (this.interactionListener) {
            const events = [
                'wheel', 'click', 'touchstart', 'keydown', 'mousedown', 
                'pointerdown', 'pointermove', 'scroll', 'touchmove', 'focus'
            ];
            // Remove listeners from all targets
            const targets = [window, document, document.body].filter(Boolean);
            events.forEach(event => {
                targets.forEach(target => {
                    target.removeEventListener(event, this.interactionListener!, { capture: true });
                });
            });
            this.interactionListener = null;
        }
    }
}
