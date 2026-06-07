import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  input
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

  private readonly elementRef = inject(ElementRef<HTMLVideoElement>);

  private player: ReturnType<typeof videojs> | null = null;

  public ngAfterViewInit(): void {
    this.player = videojs(this.elementRef.nativeElement, {
      autoplay: this.autoplay(),
      controls: this.controls(),
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
    this.player.autoplay(this.autoplay());
    this.player.controls(this.controls());
    this.player.src({ src, type: this.getMimeType(src) });
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