import {
  AfterViewInit, Component, ElementRef, Input, OnDestroy,
  effect, output, signal, untracked, viewChild
} from '@angular/core';

import videojs from 'video.js';

import { transformBoolean, transformNumber } from '@app/shared/utils';
import {
  addVideoQualitySelector,
  registerVideoQualitySelector,
  setVideoQuality
} from './video-quality-selector';
import { watchVideoTrackChanges } from './video-track-selector';
import { videoJsPtBr } from './video-pt-br';

export interface VideoSource {
  src: string;
  type?: string;
}

export interface VideoSubtitleTrack {
  src: string;
  srclang: string;
  label: string;
}

export type VideoPreload = 'auto' | 'metadata' | 'none';

export type VideoState = 'ready' | 'playing' | 'paused' | 'ended' | 'error';

export type VideoSubtitleVisibility = 'normal' | 'fullscreen' | 'hidden' | 'windowed';

export interface VideoSeekChange {
  previousTime: number;
  currentTime: number;
}

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

export function formatClockTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '--:--';
  }

  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  const pad = (value: number): string => String(value).padStart(2, '0');

  return (hours > 0 ? `${pad(hours)}:` : '') + `${pad(minutes)}:${pad(seconds)}`;
}

let clockFormatApplied = false;

function applyClockFormat(): void {
  if (clockFormatApplied) {
    return;
  }

  const videoJsTime = (videojs as unknown as {
    time: {
      setFormatTime: (format: (seconds: number, guide: number) => string) => void;
    };
  }).time;
  videoJsTime.setFormatTime((seconds: number) => formatClockTime(seconds));
  clockFormatApplied = true;
}

@Component({
  selector: 'app-video',
  standalone: true,
  template: '<video #target class="video-js vjs-big-play-centered" playsinline></video>',
  styleUrl: './video.scss'
})
export class Video implements AfterViewInit, OnDestroy {

  private _src = signal<string | null>(null);
  @Input() public set src(value: string | null) {
    if (value !== this.src) {
      this._src.set(value);
    }
  }
  public get src(): string | null {
    return this._src();
  }

  private _sources = signal<VideoSource[] | null>(null);
  @Input() public set sources(value: VideoSource[] | null) {
    if (value !== this.sources) {
      this._sources.set(value);
    }
  }
  public get sources(): VideoSource[] | null {
    return this._sources();
  }

  private _quality = signal('auto');
  @Input() public set quality(value: string) {
    if (value !== this.quality) {
      this._quality.set(value);
    }
  }
  public get quality(): string {
    return this._quality();
  }

  private _autoplay = signal(false);
  @Input({ transform: transformBoolean })
  public set autoplay(value: boolean) {
    if (value !== this.autoplay) {
      this._autoplay.set(value);
    }
  }
  public get autoplay(): boolean {
    return this._autoplay();
  }

  private _controls = signal(true);
  @Input({ transform: transformBoolean })
  public set controls(value: boolean) {
    if (value !== this.controls) {
      this._controls.set(value);
    }
  }
  public get controls(): boolean {
    return this._controls();
  }

  private _loop = signal(false);
  @Input({ transform: transformBoolean })
  public set loop(value: boolean) {
    if (value !== this.loop) {
      this._loop.set(value);
    }
  }
  public get loop(): boolean {
    return this._loop();
  }

  private _muted = signal(false);
  @Input({ transform: transformBoolean })
  public set muted(value: boolean) {
    if (value !== this.muted) {
      this._muted.set(value);
    }
  }
  public get muted(): boolean {
    return this._muted();
  }

  private _preload = signal<VideoPreload>('metadata');
  @Input() public set preload(value: VideoPreload) {
    if (value !== this.preload) {
      this._preload.set(value);
    }
  }
  public get preload(): VideoPreload {
    return this._preload();
  }

  private _poster = signal<string | null>(null);
  @Input() public set poster(value: string | null) {
    if (value !== this.poster) {
      this._poster.set(value);
    }
  }
  public get poster(): string | null {
    return this._poster();
  }

  private _playbackRate = signal(1);
  @Input({ transform: transformNumber })
  public set playbackRate(value: number) {
    if (value !== this.playbackRate) {
      this._playbackRate.set(value);
    }
  }
  public get playbackRate(): number {
    return this._playbackRate();
  }

  private _playbackRates = signal<number[]>([0.5, 0.75, 1, 1.25, 1.5, 2]);
  @Input() public set playbackRates(value: number[]) {
    if (value !== this.playbackRates) {
      this._playbackRates.set(value);
    }
  }
  public get playbackRates(): number[] {
    return this._playbackRates();
  }

  private _fluid = signal(true);
  @Input({ transform: transformBoolean })
  public set fluid(value: boolean) {
    if (value !== this.fluid) {
      this._fluid.set(value);
    }
  }
  public get fluid(): boolean {
    return this._fluid();
  }

  private _width = signal<number | null>(null);
  @Input({ transform: transformOptionalNumber })
  public set width(value: number | null) {
    if (value !== this.width) {
      this._width.set(value);
    }
  }
  public get width(): number | null {
    return this._width();
  }

  private _height = signal<number | null>(null);
  @Input({ transform: transformOptionalNumber })
  public set height(value: number | null) {
    if (value !== this.height) {
      this._height.set(value);
    }
  }
  public get height(): number | null {
    return this._height();
  }

  private _subtitleVisibility = signal<VideoSubtitleVisibility>('normal');
  @Input() public set subtitleVisibility(value: VideoSubtitleVisibility) {
    if (value !== this.subtitleVisibility) {
      this._subtitleVisibility.set(value);
    }
  }
  public get subtitleVisibility(): VideoSubtitleVisibility {
    return this._subtitleVisibility();
  }

  private _subtitleTracks = signal<VideoSubtitleTrack[]>([]);
  @Input() public set subtitleTracks(value: VideoSubtitleTrack[] | null) {
    const currentTracks = this.subtitleTracks;
    const nextTracks = value ?? [];
    const unchanged = currentTracks.length === nextTracks.length
      && currentTracks.every((track, index) => {
        const nextTrack = nextTracks[index];
        return track.src === nextTrack.src
          && track.srclang === nextTrack.srclang
          && track.label === nextTrack.label;
      });
    if (!unchanged) {
      this._subtitleTracks.set(nextTracks);
    }
  }
  public get subtitleTracks(): VideoSubtitleTrack[] {
    return this._subtitleTracks();
  }

  public readonly ready = output<void>();
  public readonly ended = output<void>();
  public readonly error = output<unknown>();
  public readonly stateChange = output<VideoState>();
  public readonly qualityChange = output<string>();
  public readonly volumeChange = output<{ volume: number; muted: boolean }>();
  public readonly audioTrackChange = output<{ label: string; language: string } | null>();
  public readonly subtitleChange = output<{ label: string; language: string } | null>();
  public readonly subtitleTextChange = output<string>();
  public readonly playbackRateChange = output<number>();
  public readonly skipped = output<VideoSeekChange>();
  public readonly rewound = output<VideoSeekChange>();

  private readonly target = viewChild<ElementRef<HTMLVideoElement>>('target');

  private player: ReturnType<typeof videojs> | null = null;
  private currentSourceKey = '';
  private appliedWidth: number | null = null;
  private appliedHeight: number | null = null;
  private appliedSubtitleVisibility: VideoSubtitleVisibility | null = null;
  private lastQualityInput = 'auto';
  private removeTrackListeners: (() => void) | null = null;
  private managedSubtitleTracks: TextTrack[] = [];
  private playerReady = false;
  private lastPlaybackTime = 0;
  private pendingSeekFrom: number | null = null;

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

    const playbackRates = this.normalizePlaybackRates(this.playbackRates);
    applyClockFormat();
    registerVideoQualitySelector();

    this.player = videojs(target, {
      language: 'pt-BR',
      languages: { 'pt-BR': videoJsPtBr },
      autoplay: this.autoplay,
      controls: this.controls,
      loop: this.loop,
      muted: this.muted,
      preload: this.preload,
      poster: this.poster ?? undefined,
      fluid: this.fluid,
      width: this.width ?? undefined,
      height: this.height ?? undefined,
      playbackRates,
      sources: desiredSources,
      children: [
        'mediaLoader',
        'posterImage',
        'titleBar',
        'textTrackDisplay',
        'loadingSpinner',
        'bigPlayButton',
        'liveTracker',
        'controlBar',
        'errorDisplay',
        'resizeManager'
      ],
      html5: {
        vhs: { overrideNative: true },
        nativeAudioTracks: false,
        nativeVideoTracks: false
      },
      controlBar: {
        children: [
          'playToggle',
          'volumePanel',
          'durationDisplay',
          'timeDivider',
          'currentTimeDisplay',
          'progressControl',
          'customControlSpacer',
          'playbackRateMenuButton',
          'chaptersButton',
          'descriptionsButton',
          'subsCapsButton',
          'audioTrackButton',
          'pictureInPictureToggle',
          'fullscreenToggle'
        ]
      }
    });
    this.appliedWidth = this.width;
    this.appliedHeight = this.height;
    this.applySubtitleVisibility(this.subtitleVisibility);

    this.currentSourceKey = this.sourceKey(desiredSources);
    this.lastQualityInput = this.quality;
    this.player.playbackRate(this.normalizePlaybackRate(this.playbackRate, playbackRates));
    this.lastPlaybackTime = this.player.currentTime() ?? 0;

    this.player.on('loadedmetadata', () => this.initializeQualitySelector());
    this.player.on('loadeddata', () => this.initializeQualitySelector());

    this.player.ready(() => {
      this.playerReady = true;
      this.syncSubtitleTracks();
      this.ready.emit();
      this.stateChange.emit('ready');
    });
    this.player.on('play', () => {
      this.stateChange.emit('playing');
    });
    this.player.on('pause', () => {
      this.stateChange.emit('paused');
    });
    this.player.on('ended', () => {
      this.ended.emit();
      this.stateChange.emit('ended');
    });
    this.player.on('error', () => {
      this.error.emit(this.player?.error() ?? { message: 'Erro de reproducao.' });
      this.stateChange.emit('error');
    });
    this.player.on('volumechange', () => {
      this.volumeChange.emit({
        volume: this.player?.volume() ?? 1,
        muted: this.player?.muted() ?? false
      });
    });
    this.player.on('ratechange', () => this.playbackRateChange.emit(this.player?.playbackRate() ?? 1));
    this.player.on('timeupdate', () => {
      if (this.player && !this.player.seeking() && this.pendingSeekFrom === null) {
        this.lastPlaybackTime = this.player.currentTime() ?? this.lastPlaybackTime;
      }
    });
    this.player.on('seeking', () => {
      if (this.pendingSeekFrom === null) {
        this.pendingSeekFrom = this.lastPlaybackTime;
      }
    });
    this.player.on('seeked', () => this.emitSeekDirection());
    this.removeTrackListeners = watchVideoTrackChanges(this.player, {
      audioTrackChange: (track) => this.audioTrackChange.emit(track),
      subtitleChange: (track) => this.subtitleChange.emit(track),
      subtitleTextChange: (text) => this.subtitleTextChange.emit(text)
    });
  }

  public ngOnDestroy(): void {
    this.removeTrackListeners?.();
    this.removeTrackListeners = null;
    this.playerReady = false;
    this.managedSubtitleTracks = [];
    this.player?.dispose();
    this.player = null;
  }

  public play(): Promise<void> | undefined {
    return this.player?.play();
  }

  public pause(): void {
    this.player?.pause();
  }

  private syncPlayerState(): void {
    const desiredSources = this.resolveSources();
    const sourceKey = this.sourceKey(desiredSources);
    const autoplay = this.autoplay;
    const controls = this.controls;
    const loop = this.loop;
    const muted = this.muted;
    const preload = this.preload;
    const poster = this.poster;
    const playbackRate = this.playbackRate;
    const playbackRates = this.normalizePlaybackRates(this.playbackRates);
    const width = this.width;
    const height = this.height;
    const quality = this.quality;
    const subtitleVisibility = this.subtitleVisibility;
    const subtitleTracks = this.subtitleTracks;

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

      if (subtitleVisibility !== this.appliedSubtitleVisibility) {
        this.applySubtitleVisibility(subtitleVisibility);
      }

      if (subtitleTracks !== this.syncedSubtitleTracks) {
        this.syncSubtitleTracks();
      }

      if (quality !== this.lastQualityInput) {
        setVideoQuality(this.player!, quality);
        this.lastQualityInput = quality;
      }

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

  private syncedSubtitleTracks: VideoSubtitleTrack[] | null = null;

  private syncSubtitleTracks(): void {
    if (!this.player || !this.playerReady) {
      return;
    }

    for (const track of this.managedSubtitleTracks) {
      this.player.removeRemoteTextTrack(track);
    }
    this.managedSubtitleTracks = [];

    for (const track of this.subtitleTracks) {
      const src = track.src.trim();
      const srclang = track.srclang.trim();
      const label = track.label.trim();
      if (!src || !srclang || !label) {
        continue;
      }

      const remoteTrack = this.player.addRemoteTextTrack({
        kind: 'subtitles',
        src,
        srclang,
        label
      }, false) as unknown as { track?: TextTrack } | undefined;
      if (remoteTrack?.track) {
        this.managedSubtitleTracks.push(remoteTrack.track);
      }
    }

    this.syncedSubtitleTracks = this.subtitleTracks;
  }

  private initializeQualitySelector(): void {
    if (!this.player) {
      return;
    }

    addVideoQualitySelector(this.player, this.quality, (quality) => {
      this.lastQualityInput = this.quality;
      this.qualityChange.emit(quality);
    });
    setVideoQuality(this.player, this.quality);
  }

  private emitSeekDirection(): void {
    if (!this.player) {
      return;
    }

    const previousTime = this.pendingSeekFrom ?? this.lastPlaybackTime;
    const currentTime = this.player.currentTime() ?? previousTime;
    const change = { previousTime, currentTime };

    if (currentTime > previousTime) {
      this.skipped.emit(change);
    } else if (currentTime < previousTime) {
      this.rewound.emit(change);
    }

    this.lastPlaybackTime = currentTime;
    this.pendingSeekFrom = null;
  }

  private applySubtitleVisibility(visibility: VideoSubtitleVisibility): void {
    if (!this.player) {
      return;
    }

    const modes: VideoSubtitleVisibility[] = ['fullscreen', 'hidden', 'windowed'];
    for (const mode of modes) {
      this.player.removeClass(`vjs-subtitle-visibility-${mode}`);
    }

    if (visibility !== 'normal') {
      this.player.addClass(`vjs-subtitle-visibility-${visibility}`);
    }

    this.appliedSubtitleVisibility = visibility;
  }

  private resolveSources(): VideoSource[] {
    const sources = this.sources;
    if (sources?.length) {
      return sources.map((source) => ({
        src: source.src,
        type: source.type ?? this.resolveMimeType(source.src)
      }));
    }

    const src = this.src;
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
