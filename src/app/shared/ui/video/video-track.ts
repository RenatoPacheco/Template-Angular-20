import videojs from 'video.js';

type VideoPlayer = ReturnType<typeof videojs>;
type VideoTrackKind = 'subtitles' | 'chapters' | 'metadata';

export interface VideoTextTrack {
  src: string;
  srclang: string;
  label: string;
}

export type VideoSubtitleTrack = VideoTextTrack;

export interface VideoTrackSelection {
  label: string;
  language: string;
}

export interface VideoMetadataCueChange extends VideoTrackSelection {
  cues: TextTrackCue[];
}

export interface VideoTrackEvents {
  audioTrackChange: (track: VideoTrackSelection | null) => void;
  subtitleChange: (track: VideoTrackSelection | null) => void;
  subtitleTextChange: (text: string) => void;
  metadataCueChange: (change: VideoMetadataCueChange) => void;
}

interface TrackCollection<TTrack> {
  length: number;
  [index: number]: TTrack;
}

interface ManagedTextTrack extends VideoTrackSelection {
  activeCues: TrackCollection<TextTrackCue & { text?: string }> | null;
  kind: string;
  mode: string;
  addEventListener(type: 'cuechange', listener: () => void): void;
  removeEventListener(type: 'cuechange', listener: () => void): void;
}

interface RemoteTrackElement {
  track?: ManagedTextTrack;
}

interface ManagedTrack {
  track: ManagedTextTrack;
  removeCueListener?: () => void;
}

export class VideoTrack {
  private readonly audioTracks: ReturnType<VideoPlayer['audioTracks']>;
  private readonly managedTracks = new Map<VideoTrackKind, ManagedTrack[]>([
    ['subtitles', []],
    ['chapters', []],
    ['metadata', []]
  ]);
  private activeSubtitleTrack: ManagedTextTrack | null = null;
  private previousSubtitleText: string | null = null;
  private destroyed = false;

  constructor(
    private readonly player: VideoPlayer,
    private readonly events: VideoTrackEvents
  ) {
    this.audioTracks = player.audioTracks();
    this.audioTracks.addEventListener('change', this.emitAudioTrack);
    this.player.on('texttrackchange', this.onTextTrackChange);
  }

  public setTracks(kind: VideoTrackKind, tracks: VideoTextTrack[]): void {
    if (this.destroyed) {
      return;
    }

    this.removeTracks(kind);
    const seen = new Set<string>();
    for (const track of tracks) {
      const src = track.src.trim();
      const srclang = track.srclang.trim();
      const label = track.label.trim();
      if (!src || !srclang || !label) {
        continue;
      }

      const key = JSON.stringify([src, srclang, label]);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);

      const element = this.player.addRemoteTextTrack({
        kind,
        src,
        srclang,
        label,
        mode: kind === 'subtitles' ? 'disabled' : 'hidden'
      }, false) as unknown as RemoteTrackElement | undefined;
      if (!element?.track) {
        continue;
      }

      const managed: ManagedTrack = { track: element.track };
      if (kind === 'metadata') {
        const onCueChange = (): void => this.emitMetadataCues(element.track!);
        element.track.addEventListener('cuechange', onCueChange);
        managed.removeCueListener = () => element.track?.removeEventListener('cuechange', onCueChange);
      }
      this.managedTracks.get(kind)!.push(managed);
    }
  }

  public destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    this.audioTracks.removeEventListener('change', this.emitAudioTrack);
    this.player.off('texttrackchange', this.onTextTrackChange);
    for (const kind of this.managedTracks.keys()) {
      this.removeTracks(kind);
    }
  }

  private readonly emitAudioTrack = (): void => {
    const tracks = this.audioTracks as unknown as TrackCollection<{
      enabled: boolean;
      label: string;
      language: string;
    }>;
    for (let index = 0; index < tracks.length; index++) {
      const track = tracks[index];
      if (track.enabled) {
        this.events.audioTrackChange({ label: track.label, language: track.language });
        return;
      }
    }

    this.events.audioTrackChange(null);
  };

  private readonly onTextTrackChange = (): void => {
    const tracks = this.player.textTracks() as unknown as TrackCollection<ManagedTextTrack>;
    let selectedTrack: ManagedTextTrack | null = null;
    for (let index = 0; index < tracks.length; index++) {
      const track = tracks[index];
      if ((track.kind === 'subtitles' || track.kind === 'captions') && track.mode === 'showing') {
        selectedTrack = track;
        break;
      }
    }

    if (selectedTrack === this.activeSubtitleTrack) {
      return;
    }

    const previousText = this.previousSubtitleText;
    this.activeSubtitleTrack?.removeEventListener('cuechange', this.emitSubtitleText);
    this.activeSubtitleTrack = selectedTrack;
    this.previousSubtitleText = null;
    this.events.subtitleChange(
      selectedTrack ? { label: selectedTrack.label, language: selectedTrack.language } : null
    );

    if (!selectedTrack) {
      if (previousText) {
        this.previousSubtitleText = '';
        this.events.subtitleTextChange('');
      }
      return;
    }

    selectedTrack.addEventListener('cuechange', this.emitSubtitleText);
    this.emitSubtitleText();
  };

  private readonly emitSubtitleText = (): void => {
    const cues = this.activeSubtitleTrack?.activeCues;
    const text = cues
      ? Array.from({ length: cues.length }, (_, index) => cues[index].text ?? '').filter(Boolean).join('\n')
      : '';

    if (text !== this.previousSubtitleText) {
      this.previousSubtitleText = text;
      this.events.subtitleTextChange(text);
    }
  };

  private emitMetadataCues(track: ManagedTextTrack): void {
    if (this.destroyed) {
      return;
    }

    const activeCues = track.activeCues;
    const cues = activeCues
      ? Array.from({ length: activeCues.length }, (_, index) => activeCues[index])
      : [];
    this.events.metadataCueChange({ label: track.label, language: track.language, cues });
  }

  private removeTracks(kind: VideoTrackKind): void {
    const tracks = this.managedTracks.get(kind) ?? [];
    for (const managed of tracks) {
      managed.removeCueListener?.();
      if (managed.track === this.activeSubtitleTrack) {
        managed.track.removeEventListener('cuechange', this.emitSubtitleText);
        this.activeSubtitleTrack = null;
        this.previousSubtitleText = '';
        this.events.subtitleChange(null);
        this.events.subtitleTextChange('');
      }
      this.player.removeRemoteTextTrack(managed.track);
    }
    this.managedTracks.set(kind, []);
  }
}
