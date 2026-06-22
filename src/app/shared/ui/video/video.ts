import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  input,
  numberAttribute
} from '@angular/core';

import videojs from 'video.js';

@Component({
  selector: 'video[app-video]',
  standalone: true,
  template: '',
  host: {
    'class': 'video-js vjs-default-skin',
    '[attr.src]': 'src()',
    '[attr.autoplay]': 'autoplay() ? true : null',
    '[attr.controls]': 'controls() ? true : null'
  }
})
export class Video implements AfterViewInit, OnDestroy {

  public src = input.required<string>();
  public autoplay = input(false);
  public controls = input(true);
  public playbackRate = input(1, { transform: numberAttribute });
  public playbackRates = input<number[]>([0.5, 0.75, 1, 1.25, 1.5, 2]);

  private readonly elementRef = inject(ElementRef<HTMLVideoElement>);

  private player: ReturnType<typeof videojs>|null = null;
  private currentSource = '';

  public ngAfterViewInit(): void {
    this.player = videojs(this.elementRef.nativeElement, {
      autoplay: this.autoplay(),
      controls: this.controls(),
      playbackRates: this.normalizePlaybackRates(this.playbackRates()),
      responsive: true,
      fluid: true,
      sources: [
        {
          src: this.src(),
          type: this.getMimeType(this.src())
        }
      ]
    });

    effect(() => {
      this.syncPlayerState();
    });
  }

  public ngOnDestroy(): void {
    this.player?.dispose();
    this.player = null;
  }

  private syncPlayerState(): void {
    if (!this.player) {
      return;
    }

    const src = this.src();
    const playbackRates = this.normalizePlaybackRates(this.playbackRates());
    const playbackRate = this.normalizePlaybackRate(this.playbackRate(), playbackRates);

    this.player.autoplay(this.autoplay());
    this.player.controls(this.controls());

    if (src !== this.currentSource) {
      this.player.src({ src, type: this.getMimeType(src) });
      this.currentSource = src;
    }

    this.player.playbackRate(playbackRate);
  }

  private normalizePlaybackRates(rates: number[]): number[] {
    const validRates = rates.filter(rate => Number.isFinite(rate) && rate > 0);
    if (!validRates.length) {
      return [1];
    }

    return [...new Set(validRates)].sort((a, b) => a - b);
  }

  private normalizePlaybackRate(rate: number, availableRates: number[]): number {
    if (!Number.isFinite(rate) || rate <= 0) {
      return 1;
    }

    if (availableRates.includes(rate)) {
      return rate;
    }

    return availableRates.includes(1) ? 1 : availableRates[0];
  }

  private getMimeType(src: string): string {
    const normalizedSrc = src.split(/[?#]/)[0].toLowerCase();

    if (normalizedSrc.endsWith('.m3u8')) {
      return 'application/x-mpegURL';
    }

    if (normalizedSrc.endsWith('.webm')) {
      return 'video/webm';
    }

    return 'video/mp4';
  }
}