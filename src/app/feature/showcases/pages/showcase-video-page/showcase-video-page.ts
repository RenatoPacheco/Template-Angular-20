import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  Video,
  VideoPreload,
  VideoSeekChange,
  VideoSource,
  VideoState,
  VideoSubtitleVisibility
} from '@app/shared/ui';

type VideoSourceMode = 'src' | 'sources';

interface ShowcaseVideoSettings {
  src: string | null;
  sources: VideoSource[] | null;
  quality: string;
  autoplay: boolean;
  controls: boolean;
  loop: boolean;
  muted: boolean;
  preload: VideoPreload;
  poster: string | null;
  playbackRate: number;
  playbackRates: number[];
  fluid: boolean;
  width: number | null;
  height: number | null;
  subtitleVisibility: VideoSubtitleVisibility;
}

@Component({
  standalone: true,
  selector: 'app-showcase-video-page',
  imports: [ReactiveFormsModule, Video],
  templateUrl: './showcase-video-page.html',
  styleUrl: './showcase-video-page.scss',
})
export class ShowcaseVideoPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly playerComponent = viewChild(Video);

  protected readonly playerGeneration = signal(0);

  protected readonly form = this.formBuilder.group({
    sourceMode: this.formBuilder.nonNullable.control<VideoSourceMode>('src'),
    src: this.formBuilder.nonNullable.control('/video/hls.m3u8', { updateOn: 'blur' }),
    sources: this.formBuilder.array([
      this.createSourceRow('/video/hls.m3u8', 'application/x-mpegURL')
    ]),
    quality: this.formBuilder.nonNullable.control('auto'),
    autoplay: this.formBuilder.nonNullable.control(false),
    controls: this.formBuilder.nonNullable.control(true),
    loop: this.formBuilder.nonNullable.control(false),
    muted: this.formBuilder.nonNullable.control(false),
    preload: this.formBuilder.nonNullable.control<VideoPreload>('metadata'),
    poster: this.formBuilder.nonNullable.control('', { updateOn: 'blur' }),
    playbackRate: this.formBuilder.nonNullable.control(1),
    playbackRates: this.formBuilder.array(
      [0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => this.formBuilder.nonNullable.control(rate))
    ),
    fluid: this.formBuilder.nonNullable.control(false),
    width: this.formBuilder.control<number | null>(640),
    height: this.formBuilder.control<number | null>(360),
    subtitleVisibility: this.formBuilder.nonNullable.control<VideoSubtitleVisibility>('normal')
  });

  private readonly formRevision = toSignal(this.form.valueChanges, { initialValue: null });
  protected readonly playerInstances = computed(() => [this.playerGeneration()]);
  protected readonly playerSettings = computed<ShowcaseVideoSettings>(() => {
    this.formRevision();
    const values = this.form.getRawValue();
    const sources = values.sourceMode === 'sources'
      ? values.sources
        .filter((source) => source.src.trim().length > 0)
        .map((source) => ({
          src: source.src.trim(),
          type: source.type.trim() || undefined
        }))
      : null;

    return {
      src: values.sourceMode === 'src' ? values.src.trim() || null : null,
      sources,
      quality: values.quality,
      autoplay: values.autoplay,
      controls: values.controls,
      loop: values.loop,
      muted: values.muted,
      preload: values.preload,
      poster: values.poster.trim() || null,
      playbackRate: values.playbackRate,
      playbackRates: values.playbackRates,
      fluid: values.fluid,
      width: values.width,
      height: values.height,
      subtitleVisibility: values.subtitleVisibility
    };
  });

  protected get sourceRows() {
    return this.form.controls.sources.controls;
  }

  protected get playbackRateRows() {
    return this.form.controls.playbackRates.controls;
  }

  private createSourceRow(src = '', type = '') {
    return this.formBuilder.nonNullable.group({
      src: this.formBuilder.nonNullable.control(src, { updateOn: 'blur' }),
      type: this.formBuilder.nonNullable.control(type, { updateOn: 'blur' })
    });
  }

  protected addSource(): void {
    this.form.controls.sources.push(this.createSourceRow());
  }

  protected removeSource(index: number): void {
    this.form.controls.sources.removeAt(index);
  }

  protected addPlaybackRate(): void {
    this.form.controls.playbackRates.push(this.formBuilder.nonNullable.control(1));
  }

  protected removePlaybackRate(index: number): void {
    this.form.controls.playbackRates.removeAt(index);
  }

  protected playVideo(): void {
    this.playerComponent()?.play()?.catch((error: unknown) => {
      console.error('[Video] Não foi possível iniciar a reprodução:', error);
    });
  }

  protected pauseVideo(): void {
    this.playerComponent()?.pause();
  }

  protected reinitializePlayer(): void {
    this.playerGeneration.update((generation) => generation + 1);
  }

  protected logQualityChange(quality: string): void {
    this.form.controls.quality.setValue(quality);
    console.log('[Video] Qualidade alterada:', quality);
  }

  protected logVolumeChange(change: { volume: number; muted: boolean }): void {
    console.log('[Video] Volume alterado:', change);
  }

  protected logAudioTrackChange(track: { label: string; language: string } | null): void {
    console.log('[Video] Faixa de audio alterada:', track);
  }

  protected logSubtitleChange(track: { label: string; language: string } | null): void {
    console.log('[Video] Legenda alterada:', track);
  }

  protected logSubtitleTextChange(text: string): void {
    console.log('[Video] Texto da legenda atualizado:', text);
  }

  protected logPlaybackRateChange(rate: number): void {
    this.form.controls.playbackRate.setValue(rate);
    console.log('[Video] Velocidade alterada:', rate);
  }

  protected logVideoStateChange(state: VideoState): void {
    console.log('[Video] Estado alterado:', state);
  }

  protected logVideoSkipped(change: VideoSeekChange): void {
    console.log('[Video] Avanço:', change);
  }

  protected logVideoRewound(change: VideoSeekChange): void {
    console.log('[Video] Retorno:', change);
  }
}
