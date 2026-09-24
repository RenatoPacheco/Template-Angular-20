import videojs from 'video.js';

interface QualityLevel {
  width?: number;
  height?: number;
  bitrate?: number;
  bandwidth?: number;
  enabled: boolean;
}

interface QualityLevels {
  length: number;
  [index: number]: QualityLevel;
  on(event: 'addqualitylevel', callback: () => void): void;
}

type VideoPlayer = ReturnType<typeof videojs>;

interface QualityPlayer extends VideoPlayer {
  qualityLevels?: () => QualityLevels;
}

interface QualityMenuItem {
  on(event: 'click', callback: () => void): void;
  hasClass(className: string): boolean;
}

interface QualityMenuButton extends QualityMenuItem {
  player_: VideoPlayer;
  el(): HTMLElement;
  addClass(className: string): void;
  controlText(text: string): string;
  update(): void;
}

interface QualityOption {
  label: string;
  value: string;
}

interface QualitySelectorOptions {
  children?: unknown[];
  className?: string;
  onQualityChange?: (quality: string) => void;
  quality?: string;
}

const MenuButton = videojs.getComponent('MenuButton') as unknown as new(
  player: VideoPlayer,
  options?: { children?: unknown[]; className?: string }
) => QualityMenuButton;
const MenuItem = videojs.getComponent('MenuItem') as unknown as new(
  player: VideoPlayer,
  options: { label: string; selectable: boolean; selected: boolean }
) => QualityMenuItem;
let isRegistered = false;
const selectorByPlayer = new WeakMap<VideoPlayer, VideoQualityMenu>();

class VideoQualityMenu extends MenuButton {
  private readonly qualityChanged?: (quality: string) => void;
  private selectedQuality = 'auto';

  constructor(player: VideoPlayer, options?: QualitySelectorOptions) {
    super(player, { className: 'vjs-quality-selector' });
    this.qualityChanged = options?.onQualityChange;
    this.selectedQuality = options?.quality ?? 'auto';
    this.addClass('vjs-quality-selector');
    const icon = this.el().querySelector('.vjs-icon-placeholder');
    icon?.classList.add('vjs-icon-hd');
    this.controlText('Qualidade');

    this.getLevels()?.on('addqualitylevel', () => {
      this.applyQuality(this.selectedQuality);
      this.update();
    });
    this.applyQuality(this.selectedQuality);
    this.update();
  }

  public createItems(): QualityMenuItem[] {
    const options = this.getQualityOptions();

    return options.map(({ label, value }) => {
      const item = new MenuItem(this.player_, {
        label,
        selectable: true,
        selected: value === (this.selectedQuality ?? 'auto')
      });

      item.on('click', () => {
        this.selectedQuality = value;
        this.applyQuality(value);
        this.update();
        this.qualityChanged?.(value);
      });

      return item;
    });
  }

  public setQuality(value: string): void {
    this.selectedQuality = this.hasQuality(value) ? value : 'auto';
    this.applyQuality(this.selectedQuality);
    this.update();
  }

  private getQualityOptions(): QualityOption[] {
    const levels = this.getLevels();
    if (!levels?.length) {
      return [{ label: this.player_.localize('Auto'), value: 'auto' }];
    }

    const withResolution = Array.from({ length: levels.length }, (_, index) => levels[index])
      .filter((level) => (level.height ?? 0) > 0);

    let options: QualityOption[];
    if (withResolution.length) {
      options = [...new Set(withResolution.map((level) => `${level.height}p`))]
        .map((label) => ({ label, value: label }));
    } else {
      const sorted = Array.from({ length: levels.length }, (_, index) => levels[index])
        .sort((a, b) => this.bandwidth(a) - this.bandwidth(b));
      const labels = sorted.length === 1
        ? ['Media']
        : sorted.length === 2
          ? ['Baixa', 'Alta']
          : sorted.map((_, index) => index === 0 ? 'Baixa' : index === sorted.length - 1 ? 'Alta' : 'Media');
      options = [...new Set(labels)].map((label) => ({ label, value: label }));
    }

    return [{ label: this.player_.localize('Auto'), value: 'auto' }, ...options];
  }

  private applyQuality(value: string): void {
    const levels = this.getLevels();
    if (!levels) {
      return;
    }

    const options = this.getQualityOptions();
    const selected = options.find((option) => option.value === value);
    const selectedLabel = selected?.label;
    if (!selected || value === 'auto') {
      for (let index = 0; index < levels.length; index++) {
        levels[index].enabled = true;
      }
      return;
    }

    const levelRecords = Array.from({ length: levels.length }, (_, index) => levels[index]);
    const hasResolution = levelRecords.some((level) => (level.height ?? 0) > 0);
    const fallbackLabels = this.getQualityOptions().filter((option) => option.value !== 'auto');

    for (let index = 0; index < levels.length; index++) {
      const level = levels[index];
      const label = hasResolution
        ? `${level.height}p`
        : fallbackLabels[this.fallbackRank(index, levelRecords)].label;
      level.enabled = label === selectedLabel;
    }
  }

  private fallbackRank(index: number, levels: QualityLevel[]): number {
    const ordered = levels
      .map((level, originalIndex) => ({ level, originalIndex }))
      .sort((a, b) => this.bandwidth(a.level) - this.bandwidth(b.level));
    const rank = ordered.findIndex((entry) => entry.originalIndex === index);
    if (levels.length === 1 || rank === 0) {
      return 0;
    }

    if (rank === levels.length - 1) {
      return levels.length === 2 ? 1 : 2;
    }

    return 1;
  }

  private hasQuality(value: string): boolean {
    return value === 'auto' || this.getQualityOptions().some((option) => option.value === value);
  }

  private bandwidth(level: QualityLevel): number {
    return level.bandwidth ?? level.bitrate ?? 0;
  }

  private getLevels(): QualityLevels | undefined {
    return (this.player_ as QualityPlayer).qualityLevels?.();
  }
}

export function registerVideoQualitySelector(): void {
  if (isRegistered) {
    return;
  }

  videojs.registerComponent(
    'VideoQualityMenu',
    VideoQualityMenu as unknown as Parameters<typeof videojs.registerComponent>[1]
  );
  isRegistered = true;
}

export function addVideoQualitySelector(
  player: VideoPlayer,
  initialQuality: string,
  onQualityChange: (quality: string) => void
): void {
  const qualityPlayer = player as QualityPlayer;
  const playerWithControlBar = player as VideoPlayer & {
    controlBar: {
      children(): QualityMenuItem[];
      addChild(name: string, options?: QualitySelectorOptions, index?: number): QualityMenuButton;
      removeChild(child: QualityMenuButton): void;
    };
  };
  const levels = qualityPlayer.qualityLevels?.();
  if (!levels?.length) {
    const existingSelector = selectorByPlayer.get(player);
    if (existingSelector) {
      playerWithControlBar.controlBar.removeChild(existingSelector);
      selectorByPlayer.delete(player);
    }
    return;
  }

  const existingSelector = selectorByPlayer.get(player);
  if (existingSelector) {
    existingSelector.setQuality(initialQuality);
    return;
  }

  const controlBarChildren = playerWithControlBar.controlBar.children();
  const pictureInPictureIndex = controlBarChildren.findIndex(
    (child) => child.hasClass('vjs-picture-in-picture-control')
  );
  const selector = playerWithControlBar.controlBar.addChild('VideoQualityMenu', {
    quality: initialQuality,
    onQualityChange
  } as QualitySelectorOptions, pictureInPictureIndex >= 0 ? pictureInPictureIndex : undefined) as VideoQualityMenu;
  selectorByPlayer.set(player, selector);
}

export function setVideoQuality(player: VideoPlayer, quality: string): void {
  selectorByPlayer.get(player)?.setQuality(quality);
}
