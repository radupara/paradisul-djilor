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

        // We use NgZone to run outside Angular to avoid triggering change detection on every event
        this.ngZone.runOutsideAngular(() => {
            this.interactionListener = this.tryAutoPlay.bind(this);
            // Listen to multiple events to catch the first user interaction
            // Use capture: true to ensure we catch the event even if propagation is stopped
            // We don't use 'once: true' because if the first attempt fails (e.g. browser blocks it),
            // we want to keep trying on subsequent events until it succeeds.
            ['click', 'touchstart', 'keydown', 'mousedown', 'pointerdown', 'pointermove', 'wheel', 'scroll', 'touchmove', 'focus'].forEach(event => {
                window.addEventListener(event, this.interactionListener!, { capture: true });
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
            // If paused during fade, we might want to stop fading or just leave it. 
            // For simplicity, we stop fading if they manually pause.
            if (this.fadeInterval) clearInterval(this.fadeInterval);
        } else {
            this.startPlayback(player);
        }
    }

    onEnded(): void {
        this.isPlaying = false;
        if (this.fadeInterval) clearInterval(this.fadeInterval);
    }

    private tryAutoPlay(event: Event): void {
        if (this.hasStarted || this.isAttemptingPlay) return;

        // console.log('Interaction detected:', event.type);

        // If the interaction is on the play button, let the button's own handler manage it
        // to avoid race conditions or double-toggles.
        const target = event.target as HTMLElement;
        if (target && target.closest && target.closest('.player-btn')) {
            return;
        }

        const player = this.audioPlayerRef.nativeElement;
        this.startPlayback(player).catch((err) => {
            // console.log('Autoplay blocked on ' + event.type, err);
        });
    }

    private async startPlayback(player: HTMLAudioElement): Promise<void> {
        if (this.isAttemptingPlay) return;
        this.isAttemptingPlay = true;

        try {
            // console.log('Attempting playback...');

            // Try playing muted first to satisfy some autoplay policies
            // player.muted = true; 
            // Actually, let's just try normal play first. Muted autoplay usually requires a click to unmute anyway.
            // But we can try to set volume to 0 (which we did) and play.

            await player.play();
            // console.log('Playback started successfully');

            this.ngZone.run(() => {
                this.isPlaying = true;
                this.hasStarted = true;
            });

            this.removeListeners();
            this.startFadeIn(player);

        } catch (error) {
            this.isAttemptingPlay = false;
            throw error;
        }
    }
    private startFadeIn(player: HTMLAudioElement): void {
        // If already at target volume, do nothing
        if (player.volume >= this.TARGET_VOLUME) return;

        const stepTime = this.FADE_DURATION / this.FADE_STEPS;
        const volumeStep = this.TARGET_VOLUME / this.FADE_STEPS;

        this.ngZone.runOutsideAngular(() => {
            this.fadeInterval = setInterval(() => {
                if (!this.isPlaying) {
                    clearInterval(this.fadeInterval);
                    return;
                }

                const newVolume = Math.min(player.volume + volumeStep, this.TARGET_VOLUME);
                player.volume = newVolume;

                if (newVolume >= this.TARGET_VOLUME) {
                    clearInterval(this.fadeInterval);
                }
            }, stepTime);
        });
    }

    private removeListeners(): void {
        if (this.interactionListener) {
            ['click', 'touchstart', 'keydown', 'mousedown', 'pointerdown', 'wheel', 'scroll', 'touchmove', 'focus'].forEach(event => {
                window.removeEventListener(event, this.interactionListener!, { capture: true });
            });
            this.interactionListener = null;
        }
    }
}
