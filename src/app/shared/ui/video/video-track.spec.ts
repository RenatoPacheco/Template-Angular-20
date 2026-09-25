import videojs from 'video.js';

import { VideoTrack, VideoTrackEvents, VideoTextTrack } from './video-track';

interface FakeTrack {
  label: string;
  language: string;
  kind: string;
  mode: string;
  activeCues: { length: number; [index: number]: TextTrackCue & { text?: string } } | null;
  listeners: Map<string, () => void>;
  addEventListener: (type: 'cuechange', listener: () => void) => void;
  removeEventListener: (type: 'cuechange', listener: () => void) => void;
}

describe('VideoTrack', () => {
  let manager: VideoTrack;
  let events: jasmine.SpyObj<VideoTrackEvents>;
  let textTracks: FakeTrack[];
  let audioListeners: Map<string, () => void>;
  let playerListeners: Map<string, (...args: unknown[]) => void>;
  let audioTracks: { length: number; [index: number]: { enabled: boolean; label: string; language: string } };
  let addRemoteTextTrack: jasmine.Spy;
  let removeRemoteTextTrack: jasmine.Spy;

  const subtitle: VideoTextTrack = {
    src: '/captions/pt.vtt',
    srclang: 'pt-BR',
    label: 'Português'
  };

  beforeEach(() => {
    textTracks = [];
    audioListeners = new Map();
    playerListeners = new Map();
    audioTracks = { length: 0 };
    events = jasmine.createSpyObj<VideoTrackEvents>([
      'audioTrackChange',
      'subtitleChange',
      'subtitleTextChange',
      'metadataCueChange'
    ]);

    addRemoteTextTrack = jasmine.createSpy('addRemoteTextTrack').and.callFake((options) => {
      const track = createTrack(options);
      textTracks.push(track);
      return { track };
    });
    removeRemoteTextTrack = jasmine.createSpy('removeRemoteTextTrack').and.callFake((track) => {
      textTracks = textTracks.filter((item) => item !== track);
    });

    const player = {
      audioTracks: () => ({
        get length() {
          return audioTracks.length;
        },
        get 0() {
          return audioTracks[0];
        },
        addEventListener: (type: string, listener: () => void) => audioListeners.set(type, listener),
        removeEventListener: (type: string) => audioListeners.delete(type)
      }),
      textTracks: () => textTracks,
      on: (type: string, listener: (...args: unknown[]) => void) => playerListeners.set(type, listener),
      off: (type: string) => playerListeners.delete(type),
      addRemoteTextTrack,
      removeRemoteTextTrack
    } as unknown as ReturnType<typeof videojs>;

    manager = new VideoTrack(player, events);
  });

  it('replaces only its own valid remote tracks without creating duplicates', () => {
    manager.setTracks('subtitles', [subtitle, { ...subtitle }, { ...subtitle, src: ' ' }]);

    expect(addRemoteTextTrack).toHaveBeenCalledTimes(1);
    expect(addRemoteTextTrack).toHaveBeenCalledWith(jasmine.objectContaining({
      kind: 'subtitles',
      src: subtitle.src,
      srclang: subtitle.srclang,
      label: subtitle.label
    }), false);
    const registeredTrack = textTracks[0];

    manager.setTracks('subtitles', [{ ...subtitle, src: '/captions/fr.vtt', srclang: 'fr', label: 'Français' }]);

    expect(removeRemoteTextTrack).toHaveBeenCalledWith(registeredTrack);
    expect(textTracks).toHaveSize(1);
    expect(textTracks[0].label).toBe('Français');
  });

  it('emits active metadata cues and keeps metadata tracks hidden', () => {
    manager.setTracks('metadata', [{ ...subtitle, label: 'Événements' }]);

    const metadataTrack = textTracks[0];
    const cue = { startTime: 2, endTime: 3, text: 'marker' } as unknown as TextTrackCue;
    metadataTrack.activeCues = { length: 1, 0: cue as TextTrackCue & { text?: string } };
    metadataTrack.listeners.get('cuechange')?.();

    expect(addRemoteTextTrack).toHaveBeenCalledWith(jasmine.objectContaining({
      kind: 'metadata',
      mode: 'hidden'
    }), false);
    expect(events.metadataCueChange).toHaveBeenCalledWith({
      label: 'Événements',
      language: 'pt-BR',
      cues: [cue]
    });

    manager.setTracks('metadata', []);
    expect(metadataTrack.listeners.has('cuechange')).toBeFalse();
    expect(removeRemoteTextTrack).toHaveBeenCalledWith(metadataTrack);
  });

  it('registers chapter tracks for the Video.js chapter navigation control', () => {
    manager.setTracks('chapters', [{
      src: '/chapters/video.vtt',
      srclang: 'pt-BR',
      label: 'Capítulos'
    }]);

    expect(addRemoteTextTrack).toHaveBeenCalledWith(jasmine.objectContaining({
      kind: 'chapters',
      src: '/chapters/video.vtt',
      mode: 'hidden'
    }), false);
  });

  it('preserves selection callbacks and removes listeners and tracks on destroy', () => {
    manager.setTracks('subtitles', [subtitle]);
    const selectedSubtitle = textTracks[0];
    selectedSubtitle.mode = 'showing';
    selectedSubtitle.activeCues = {
      length: 1,
      0: { text: 'Olá', startTime: 0, endTime: 1 } as unknown as TextTrackCue & { text?: string }
    };
    playerListeners.get('texttrackchange')?.();

    audioTracks.length = 1;
    audioTracks[0] = { enabled: true, label: 'Stereo', language: 'pt-BR' };
    audioListeners.get('change')?.();

    expect(events.subtitleChange).toHaveBeenCalledWith({ label: 'Português', language: 'pt-BR' });
    expect(events.subtitleTextChange).toHaveBeenCalledWith('Olá');
    expect(events.audioTrackChange).toHaveBeenCalledWith({ label: 'Stereo', language: 'pt-BR' });

    manager.destroy();

    expect(audioListeners.has('change')).toBeFalse();
    expect(playerListeners.has('texttrackchange')).toBeFalse();
    expect(removeRemoteTextTrack).toHaveBeenCalledWith(selectedSubtitle);
    expect(textTracks).toHaveSize(0);
  });
});

function createTrack(options: { kind: string; srclang: string; label: string; mode: string }): FakeTrack {
  const listeners = new Map<string, () => void>();
  return {
    label: options.label,
    language: options.srclang,
    kind: options.kind,
    mode: options.mode,
    activeCues: null,
    listeners,
    addEventListener: (type, listener) => listeners.set(type, listener),
    removeEventListener: (type) => listeners.delete(type)
  };
}
