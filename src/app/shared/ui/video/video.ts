import {
  AfterViewInit, Component, ElementRef, OnDestroy,
  effect, input, output, untracked, viewChild
} from '@angular/core';

import videojs from 'video.js';

import { transformBoolean, transformNumber } from '@app/shared/utils';

export interface VideoSource {
  src: string;
  type?: string;
}

export type VideoPreload = 'auto' | 'metadata' | 'none';

function transformOptionalNumber(value: number | string | null): number | null {
  if (value === null || value === '') {
    return null;
  }

  const parsed = transformNumber(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.round(parsed);
}

@Component({
  selector: 'app-video',
  standalone: true,
  template: '<video #target class="video-js vjs-big-play-centered" playsinline></video>'
})
export class Video implements AfterViewInit, OnDestroy {

  public src = input<string | null>(null);
  public sources = input<VideoSource[] | null>(null);
  public autoplay = input(false, { transform: transformBoolean });
  public controls = input(true, { transform: transformBoolean });
  public loop = input(false, { transform: transformBoolean });
  public muted = input(false, { transform: transformBoolean });
  public preload = input<VideoPreload>('metadata');
  public poster = input<string | null>(null);
  public playbackRate = input(1, { transform: transformNumber });
  public playbackRates = input<number[]>([0.5, 0.75, 1, 1.25, 1.5, 2]);
  public fluid = input(true, { transform: transformBoolean });
  public width = input<number | null, number | string | null>(null, { transform: transformOptionalNumber });
  public height = input<number | null, number | string | null>(null, { transform: transformOptionalNumber });

  public readonly ready = output<void>();
  public readonly play = output<void>();
  public readonly pause = output<void>();
  public readonly ended = output<void>();
  public readonly error = output<unknown>();

  private readonly target = viewChild<ElementRef<HTMLVideoElement>>('target');

  private player: ReturnType<typeof videojs> | null = null;
  private currentSourceKey = '';
  private appliedWidth: number | null = null;
  private appliedHeight: number | null = null;

  constructor() {
    effect(() => {
      this.syncPlayerState();
    });
  }

  public ngAfterViewInit(): void {
    const target = this.target()?.nativeElement;
    if (!target) {
      return;
    }

    const desiredSources = this.resolveSources();
    if (!desiredSources.length) {
      this.error.emit({ message: 'Nenhuma fonte de video informada (src ou sources).' });
      return;
    }

    const playbackRates = this.normalizePlaybackRates(this.playbackRates());

    this.player = videojs(target, {
      autoplay: this.autoplay(),
      controls: this.controls(),
      loop: this.loop(),
      muted: this.muted(),
      preload: this.preload(),
      poster: this.poster() ?? undefined,
      fluid: this.fluid(),
      width: this.width() ?? undefined,
      height: this.height() ?? undefined,
      playbackRates,
      sources: desiredSources
    });
    this.appliedWidth = this.width();
    this.appliedHeight = this.height();

    this.currentSourceKey = this.sourceKey(desiredSources);
    this.player.playbackRate(this.normalizePlaybackRate(this.playbackRate(), playbackRates));

    this.player.ready(() => {
      this.ready.emit();
    });
    this.player.on('play', () => this.play.emit());
    this.player.on('pause', () => this.pause.emit());
    this.player.on('ended', () => this.ended.emit());
    this.player.on('error', () => this.error.emit(this.player?.error() ?? { message: 'Erro de reproducao.' }));
  }

  public ngOnDestroy(): void {
    this.player?.dispose();
    this.player = null;
  }

  private syncPlayerState(): void {
    const desiredSources = this.resolveSources();
    const sourceKey = this.sourceKey(desiredSources);
    const autoplay = this.autoplay();
    const controls = this.controls();
    const loop = this.loop();
    const muted = this.muted();
    const preload = this.preload();
    const poster = this.poster();
    const playbackRate = this.playbackRate();
    const playbackRates = this.normalizePlaybackRates(this.playbackRates());
    const width = this.width();
    const height = this.height();

    if (!this.player) {
      return;
    }

    untracked(() => {
      if (desiredSources.length && sourceKey !== this.currentSourceKey) {
        this.player?.src(desiredSources);
        this.currentSourceKey = sourceKey;
      }

      this.player?.autoplay(autoplay);
      this.player?.controls(controls);
      this.player?.loop(loop);
      this.player?.muted(muted);
      this.player?.preload(preload);
      if (poster) {
        this.player?.poster(poster);
      }

      this.player?.playbackRate(this.normalizePlaybackRate(playbackRate, playbackRates));

      if (width !== null && width !== this.appliedWidth) {
        this.player?.width(width);
        this.appliedWidth = width;
      }
      if (height !== null && height !== this.appliedHeight) {
        this.player?.height(height);
        this.appliedHeight = height;
      }
    });
  }

  private resolveSources(): VideoSource[] {
    const sources = this.sources();
    if (sources?.length) {
      return sources.map((source) => ({
        src: source.src,
        type: source.type ?? this.resolveMimeType(source.src)
      }));
    }

    const src = this.src();
    if (src) {
      return [{ src, type: this.resolveMimeType(src) }];
    }

    return [];
  }

  private sourceKey(sources: VideoSource[]): string {
    return JSON.stringify(sources);
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

  private resolveMimeType(src: string): string {
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
