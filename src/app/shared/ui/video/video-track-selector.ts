import videojs from 'video.js';

type VideoPlayer = ReturnType<typeof videojs>;

export interface VideoTrackSelection {
  label: string;
  language: string;
}

interface AudioTrack extends VideoTrackSelection {
  enabled: boolean;
}

interface TextTrack extends VideoTrackSelection {
  activeCues: TrackCollection<{ text: string }> | null;
  kind: string;
  mode: string;
  addEventListener(type: 'cuechange', listener: () => void): void;
  removeEventListener(type: 'cuechange', listener: () => void): void;
}

interface TrackCollection<TTrack> {
  length: number;
  [index: number]: TTrack;
}

export interface VideoTrackSelectorEvents {
  audioTrackChange: (track: VideoTrackSelection | null) => void;
  subtitleChange: (track: VideoTrackSelection | null) => void;
  subtitleTextChange: (text: string) => void;
}

export function watchVideoTrackChanges(
  player: VideoPlayer,
  events: VideoTrackSelectorEvents
): () => void {
  const audioTracks = player.audioTracks();
  let activeSubtitleTrack: TextTrack | null = null;
  let previousSubtitleText: string | null = null;

  const emitAudioTrack = (): void => {
    const tracks = audioTracks as unknown as TrackCollection<AudioTrack>;
    for (let index = 0; index < tracks.length; index++) {
      const track = tracks[index];
      if (track.enabled) {
        events.audioTrackChange({ label: track.label, language: track.language });
        return;
      }
    }

    events.audioTrackChange(null);
  };

  const emitSubtitleText = (): void => {
    const cues = activeSubtitleTrack?.activeCues;
    const text = cues
      ? Array.from({ length: cues.length }, (_, index) => cues[index].text).filter(Boolean).join('\n')
      : '';

    if (text !== previousSubtitleText) {
      previousSubtitleText = text;
      events.subtitleTextChange(text);
    }
  };

  const onSubtitleCueChange = (): void => emitSubtitleText();

  const onTextTrackChange = (): void => {
    const tracks = player.textTracks() as unknown as TrackCollection<TextTrack>;
    let selectedTrack: TextTrack | null = null;

    for (let index = 0; index < tracks.length; index++) {
      const track = tracks[index];
      if ((track.kind === 'subtitles' || track.kind === 'captions') && track.mode === 'showing') {
        selectedTrack = track;
        break;
      }
    }

    if (selectedTrack === activeSubtitleTrack) {
      return;
    }

    const previousText = previousSubtitleText;
    activeSubtitleTrack?.removeEventListener('cuechange', onSubtitleCueChange);
    activeSubtitleTrack = selectedTrack;
    previousSubtitleText = null;
    events.subtitleChange(
      selectedTrack ? { label: selectedTrack.label, language: selectedTrack.language } : null
    );

    if (!selectedTrack) {
      if (previousText) {
        previousSubtitleText = '';
        events.subtitleTextChange('');
      }
      return;
    }

    selectedTrack.addEventListener('cuechange', onSubtitleCueChange);
    emitSubtitleText();
  };

  const onAudioTrackChange = (): void => emitAudioTrack();
  audioTracks.addEventListener('change', onAudioTrackChange);
  player.on('texttrackchange', onTextTrackChange);

  return () => {
    audioTracks.removeEventListener('change', onAudioTrackChange);
    player.off('texttrackchange', onTextTrackChange);
    activeSubtitleTrack?.removeEventListener('cuechange', onSubtitleCueChange);
  };
}
