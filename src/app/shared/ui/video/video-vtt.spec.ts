import { VideoItemVtt, VideoVtt } from '@app/shared/ui';

describe('VideoVtt', () => {
  it('parses cue identifiers, timestamps and multiline cue text', () => {
    const vtt = new VideoVtt();
    vtt.readVttText(
      'WEBVTT - Demo\r\n\r\n'
      + 'intro\r\n00:00:01.250 --> 00:00:02.500 line:90%\r\n'
      + 'Linha um\r\nLinha dois\r\n\r\n'
      + '00:02.500 --> 00:03.000\r\n{ "event": "marcador" }\r\n'
    );

    expect(vtt.length).toBe(2);
    expect(vtt.items[0].id).toBe('intro');
    expect(vtt.items[0].start).toBe(1.25);
    expect(vtt.items[0].end).toBe(2.5);
    expect(vtt.items[0].value).toBe('Linha um\nLinha dois');
    expect(vtt.items[1].value).toBe('{ "event": "marcador" }');
  });

  it('rejects malformed headers, timestamps and cue ranges', () => {
    const vtt = new VideoVtt();

    expect(() => vtt.readVttText('NOT WEBVTT\n\n00:00:01.000 --> 00:00:02.000\nCue'))
      .toThrowError(SyntaxError);
    expect(() => vtt.readVttText('WEBVTT\n\n00:61:01.000 --> 00:00:02.000\nCue'))
      .toThrowError(SyntaxError);
    expect(() => vtt.readVttText('WEBVTT\n\n00:00:03.000 --> 00:00:02.000\nCue'))
      .toThrowError(RangeError);
  });

  it('serializes cues and creates a text/vtt Blob', async () => {
    const source = new VideoVtt('pt-BR', 'Metadata', [
      new VideoItemVtt({
        id: 'event-1',
        start: 1.25,
        end: 2.5,
        value: { type: 'highlight', title: 'Ponto importante' }
      }),
      new VideoItemVtt({ start: 3, end: 4, value: 'Cue multiline\nsegunda linha' })
    ]);

    const serialized = source.toString();
    expect(serialized.startsWith('WEBVTT\n\n')).toBeTrue();
    expect(serialized).toContain('event-1\n00:00:01.250 --> 00:00:02.500');
    expect(serialized).toContain('{"type":"highlight","title":"Ponto importante"}');
    expect(serialized).toContain('Cue multiline\nsegunda linha');

    const parsed = new VideoVtt();
    parsed.readVttText(serialized);
    expect(parsed.items[0].equals(source.items[0])).toBeTrue();
    expect(parsed.items[1].equals(source.items[1])).toBeTrue();

    const blob = source.toBlob();
    expect(blob.type).toBe('text/vtt');
    expect(await blob.text()).toBe(serialized);
  });

  it('supports empty files containing only the WebVTT header', () => {
    const vtt = new VideoVtt();
    vtt.readVttText('WEBVTT\n');

    expect(vtt.length).toBe(0);
    expect(vtt.toString()).toBe('WEBVTT\n');
  });
});
