import { Component } from '@angular/core';

import { Video, VideoSeekChange, VideoState } from '@app/shared/ui';

@Component({
  standalone: true,
  selector: 'app-showcase-video-page',
  imports: [Video],
  templateUrl: './showcase-video-page.html',
  styleUrl: './showcase-video-page.scss',
})
export class ShowcaseVideoPage {
  protected logQualityChange(quality: string): void {
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
    console.log('[Video] Velocidade alterada:', rate);
  }

  protected logVideoStateChange(state: VideoState): void {
    console.log('[Video] Estado alterado:', state);
  }

  protected logVideoSkipped(change: VideoSeekChange): void {
    console.log('[Video] Avanco:', change);
  }

  protected logVideoRewound(change: VideoSeekChange): void {
    console.log('[Video] Retorno:', change);
  }
}
