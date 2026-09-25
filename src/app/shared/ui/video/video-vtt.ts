export interface IVideoItemVtt {
  value: string | object;
  start: number;
  end: number;
  id?: string;
}

export class VideoItemVtt implements IVideoItemVtt {
  public value: string | object;
  public start: number;
  public end: number;
  public id?: string;

  public constructor({ value, start, end, id }: IVideoItemVtt) {
    this.value = value;
    this.start = start;
    this.end = end;
    this.id = id;
  }

  public toString(): string {
    if (this.end <= this.start) {
      throw new RangeError('O fim do cue WebVTT deve ser posterior ao início.');
    }
    if (this.id?.includes('\n') || this.id?.includes('\r')) {
      throw new SyntaxError('O identificador de um cue WebVTT não pode conter quebras de linha.');
    }

    const lines = [
      ...(this.id ? [this.id] : []),
      `${this.formatTime(this.start)} --> ${this.formatTime(this.end)}`,
      this.textValue()
    ];
    return lines.join('\n');
  }

  public equals(other: IVideoItemVtt | null | undefined): boolean {
    return Boolean(other)
      && this.id === other!.id
      && this.textValue() === this.toText(other!.value)
      && this.start === other!.start
      && this.end === other!.end;
  }

  public textValue(): string {
    if (typeof this.value === 'string') {
      return this.value;
    }

    return this.toText(this.value);
  }

  private toText(value: string | object): string {
    if (typeof value === 'string') {
      return value;
    }
    const serialized = JSON.stringify(value);
    if (serialized === undefined) {
      throw new TypeError('O conteúdo do cue não pode ser serializado.');
    }
    return serialized;
  }

  private formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) {
      throw new RangeError('O tempo de um cue WebVTT deve ser um número finito não negativo.');
    }

    const totalMilliseconds = Math.round(seconds * 1000);
    const hours = Math.floor(totalMilliseconds / 3_600_000);
    const minutes = Math.floor((totalMilliseconds % 3_600_000) / 60_000);
    const wholeSeconds = Math.floor((totalMilliseconds % 60_000) / 1000);
    const milliseconds = totalMilliseconds % 1000;
    const pad = (value: number, size = 2): string => String(value).padStart(size, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(wholeSeconds)}.${pad(milliseconds, 3)}`;
  }
}

export class VideoVtt {
  private _items: VideoItemVtt[] = [];
  public language: string;
  public label: string;

  public constructor(language = '', label = '', items: VideoItemVtt[] = []) {
    this.language = language;
    this.label = label;
    this._items = [...items];
  }

  public add(item: VideoItemVtt): void {
    this._items.push(item);
  }

  public contains(item: VideoItemVtt): boolean {
    return this._items.some((candidate) => candidate.equals(item));
  }

  public get length(): number {
    return this._items.length;
  }

  public concat(items: VideoItemVtt[]): void {
    this._items = this._items.concat(items);
  }

  public get items(): VideoItemVtt[] {
    return [...this._items];
  }

  public clear(): void {
    this._items = [];
  }

  public readVttText(text: string): void {
    this._items = this.parse(text);
  }

  public toString(): string {
    const cues = this._items.map((item) => item.toString()).join('\n\n');
    return cues ? `WEBVTT\n\n${cues}\n` : 'WEBVTT\n';
  }

  public toBlob(): Blob {
    return new Blob([this.toString()], { type: 'text/vtt' });
  }

  public generateUrl(): string {
    return URL.createObjectURL(this.toBlob());
  }

  public equals(other: VideoVtt | null | undefined): boolean {
    return Boolean(other)
      && this.language === other!.language
      && this.label === other!.label
      && this._items.length === other!.length
      && this._items.every((item, index) => item.equals(other!.items[index]));
  }

  private parse(source: string): VideoItemVtt[] {
    const normalized = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
    const lines = normalized.split('\n');
    const header = lines[0]?.trim();
    if (!header || !/^WEBVTT(?:[ \t].*)?$/.test(header)) {
      throw new SyntaxError('O conteúdo não possui um cabeçalho WEBVTT válido.');
    }

    const firstCueLine = lines.findIndex((line, index) => index > 0 && line.trim() === '');
    if (firstCueLine < 0) {
      if (lines.slice(1).every((line) => line.trim() === '')) {
        return [];
      }
      throw new SyntaxError('O cabeçalho WebVTT deve ser separado dos cues por uma linha vazia.');
    }

    const cueLines = lines.slice(firstCueLine + 1);
    while (cueLines[0]?.trim() === '') {
      cueLines.shift();
    }
    while (cueLines[cueLines.length - 1]?.trim() === '') {
      cueLines.pop();
    }
    if (!cueLines.length) {
      return [];
    }

    const blocks = cueLines.join('\n').split(/\n[ \t]*\n+/);
    const items: VideoItemVtt[] = [];
    for (const block of blocks) {
      const blockLines = block.split('\n');
      const firstLine = blockLines[0]?.trim() ?? '';
      if (!firstLine || firstLine === 'NOTE' || firstLine.startsWith('NOTE ')
        || firstLine === 'STYLE' || firstLine === 'REGION') {
        continue;
      }

      const cueTimingIndex = this.findCueTimingLine(blockLines);
      if (cueTimingIndex < 0 || cueTimingIndex > 1) {
        throw new SyntaxError(`Bloco WebVTT inválido: ${firstLine}`);
      }

      const cueId = cueTimingIndex === 1 ? blockLines[0].trim() : undefined;
      const timingLine = blockLines[cueTimingIndex].trim();
      const timing = timingLine.match(/^([^\s]+)\s+-->\s+([^\s]+)(?:\s+.*)?$/);
      if (!timing) {
        throw new SyntaxError(`Linha de tempo WebVTT inválida: ${timingLine}`);
      }

      const start = this.parseTimestamp(timing[1]);
      const end = this.parseTimestamp(timing[2]);
      if (end <= start) {
        throw new RangeError('O fim do cue WebVTT deve ser posterior ao início.');
      }

      const value = blockLines.slice(cueTimingIndex + 1).join('\n');
      items.push(new VideoItemVtt({ value, start, end, id: cueId }));
    }

    return items;
  }

  private findCueTimingLine(lines: string[]): number {
    for (let index = 0; index < Math.min(lines.length, 2); index++) {
      if (lines[index].includes('-->')) {
        return index;
      }
    }
    return -1;
  }

  private parseTimestamp(timestamp: string): number {
    const match = timestamp.match(/^(?:(\d{2,}):)?([0-5]\d):([0-5]\d)\.(\d{3})$/);
    if (!match) {
      throw new SyntaxError(`Timestamp WebVTT inválido: ${timestamp}`);
    }

    const hours = Number(match[1] ?? 0);
    const minutes = Number(match[2]);
    const seconds = Number(match[3]);
    const milliseconds = Number(match[4]);
    const parsed = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
    if (!Number.isFinite(parsed)) {
      throw new RangeError(`Timestamp WebVTT fora do intervalo suportado: ${timestamp}`);
    }
    return parsed;
  }
}
