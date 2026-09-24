# Design

## Context

Estado atual (`src/app/shared/ui/video/video.ts`): seletor `video[app-video]`, `template: ''`, host bindings `[attr.src]/[attr.autoplay]/[attr.controls]` convivendo com `videojs(el, { sources })`, e `effect()` criado dentro de `ngAfterViewInit` — fora de injection context (NG0608 em runtime; `tsc` e `ng build` passam limpo). `currentSource = ''` nunca inicializado causa reload duplo no primeiro sync. `playbackRates` so tem efeito no init, mas o sync sugere reatividade. Booleanos sem `transformBoolean` divergem do padrao do repo (`button`, `label`, `form-editor` usam `@app/shared/utils`). CSS usa `vjs-default-skin` (legada, v5) na v8 instalada. Unico consumo: `showcase-video-page.html` com `<video app-video>`. Projeto zoneless (`provideZonelessChangeDetection`). Ver `proposal.md` para motivacao.

## Goals / Non-Goals

**Goals:**

- Eliminar o throw NG0608 e o duplo carregamento inicial.
- Separar fronteiras: Angular (inputs/outputs) vs video.js (no interno privado).
- Definir live vs init-only e documentar no showcase.
- Convergir para `transformBoolean` / `transformNumber` do repo e prefixo `app`.

**Non-Goals:**

- Chrome 100% custom (botoes/skin proprios) — mantem skin default do video.js neste change.
- SSR/guard `isPlatformBrowser`, DVR/live-edge, DASH (`.mpd`), legendas/tracks — ficam para changes futuras.
- Suporte a `<source>` projetado via content projection (optado por `sources: Source[]` via input, mais simples e testavel).

## Decisions

1. **Seletor `app-video` (elemento) com `<video #target>` interno.**
   Racional: o host deixa de ser o no gerenciado pelo video.js; fim do conflito host-attr vs `player.src()`. Alternativa considerada (manter `video[app-video]` e so remover host bindings): rejeitada porque `template: ''` impediria evolucao (multi-fontes, overlay, loading) e manteria semantica confusa de atributo HTML.

2. **Reatividade via `effect` no construtor (injection context) + guard `player == null`, ou `ngOnChanges` equivalente.**
   Racional: corrige NG0608 e garante dispose automatico com o componente. `syncPlayerState` le signals com `untracked` ao redor de chamadas do player para nao criar dependencias espurias. Alternativa (`afterNextRender` + `effect`): valida, mas construtor e mais simples e alinhado ao zoneless.

3. **`src: string | null` + `sources: VideoSource[] | null` (um dos dois obrigatorio).**
   Racional: cobre caso atual (mp4 unico) e evolucao (fallback webm/mp4, HLS). `getMimeType` atual estendido para `mp4/webm/m3u8`, default `video/mp4`; entradas `sources` ja trazem `type` explicito. Alternativa (content projection de `<source>`): rejeitada — leitura de DOM no init e mais fragil e dificil de tipar/testar.

4. **Live: `src/sources`, `controls`, `autoplay`, `loop`, `muted`, `playbackRate`. Init-only: `playbackRates`, `fluid`, `aspectRatio`.**
   Racional: video.js so constroi o `playbackRateMenuButton` e layout fluido no init; fingir reatividade gera menu stale. `playbackRate` live via `player.playbackRate()` com normalizacao (`normalizePlaybackRate(s)` reaproveitada).

5. **Transforms do repo + `input()` signals; `output()` para `ready/play/pause/ended/error`.**
   Racional: consistencia com `button`/`form-editor`; `error` e essencial porque hoje falha de stream e silenciosa. `ready` expoe o instante pos-`videojs()` para o showcase/testes.

6. **Classe `video-js` apenas; revisar import do CSS.**
   Racional: `vjs-default-skin` nao existe na v8. Verificar `angular.json`/`styles.scss` para `video.js/dist/video-js.css`; sem isso o player parece "quebrado" mesmo funcional.

## Risks / Trade-offs

- [Breaking `video[app-video]` -> `app-video`] → Mitigacao: unico uso interno e o showcase; migracao mecanica + nota `feat!` no commit.
- [video.js manipula DOM fora do Angular zoneless] → Mitigacao: criar player em `ngAfterViewInit`, dispor em `ngOnDestroy`; listeners via outputs, sem `setAttribute` no host apos init.
- [`playbackRates` init-only pode surpreender] → Mitigacao: documentar no showcase + spec; opcao futura de `recreate()` explicito.
- [`muted + autoplay` e politica de browser] → Mitigacao: exemplo do showcase usa `muted` quando `autoplay`.
- [Tipo `videojs` player como `ReturnType<typeof videojs>`] → Mitigacao: manter tipagem atual + `@types/video.js`.

## Migration Plan

1. Reescrever `video.ts` como `app-video` (novo template com `<video #target class="video-js">`).
2. Atualizar `showcase-video-page.{html,ts}` para `<app-video>` com exemplos: fonte unica, `playbackRate(s)`, `error`.
3. `ng build` + abertura manual do showcase (validar NG0608 sumiu, sem duplo load via Network).
4. Rollback: reverter o commit unico (change isolado, sem dependencia de outros changes).

## Open Questions

- `fluid` default deve seguir `true` (comportamento atual chapado) ou `false` (neutro)? Proposta: `true` para nao mudar layout existente; confirmar com UX.
- Expor `player`/`videojs` instance via `viewChild`/metodo publico (ex.: `play()`, `pause()` programaticos) ja neste change ou deixar so via inputs? Sugestao: deixar fora do v1.
