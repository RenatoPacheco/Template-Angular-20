# Design

## Context

Estado atual (branch `feature/migrate-video-to-app-video`): `app-video` (`src/app/shared/ui/video/video.ts`) cria o player com opcoes default — a control bar e a da skin padrao do video.js v8, sem `video.scss` (componente sem `styleUrl`). A ordem dos filhos da `controlBar` vem da lib. Ver `proposal.md` para motivacao.

## Goals / Non-Goals

**Goals:**

- Layout em 2 linhas (progresso full-width em cima; grupos esquerda/direita embaixo) igual em todos os tamanhos.
- Zero manipulacao de DOM do player via JS; sobreviver a updates do video.js v8.

**Non-Goals:**

- Novos botoes, troca de icones ou nova skin — so reposicionamento dos controles default.
- Mudar a API de inputs/outputs do `app-video`.
- Comportamento de `live`/`seekToLive` (fora do uso atual, so VOD).

## Decisions

1. **Layout 100% CSS em novo `video.scss` (`styleUrl: './video.scss'`).**
   Racional: a `controlBar` do video.js e flex; com `flex-wrap` + `order` + `flex-basis: 100%` no `progressControl` obtem-se as 2 linhas sem tocar no JS nem forkar a skin. Alternativas consideradas: (a) reordenar filhos via opcao `controlBar.children` no init — fragil, depende de nomes internos e nao cria as "linhas"; (b) manipular DOM pos-init (`addChild`/`detach`) — quebra com updates e com `dispose`. CSS respeita o budget de estilo do componente (4kB warning / 8kB error).

2. **Fixar a ordem dos filhos via opcao `controlBar` no `videojs()` apenas se necessario.**
   Racional: a ordem default v8 ja e `playToggle, volumePanel, currentTime, timeDivider, duration, ..., spacer, playbackRate, fullscreen, PiP`. Se a ordem default se confirmar no spike visual, nenhuma opcao JS e necessaria — so CSS (`margin-left: auto` no primeiro item do grupo direito ou uso do `spacer` default com `flex-grow`). Decisao final no ato da implementacao, com fallback CSS-only.

3. **Tempo como `currentTime + timeDivider + duration` (formato `atual / total`).**
   Racional: reaproveita os displays default; o `timeDivider` default ja renderiza `/`. Sem componente custom de tempo.

4. **Escopo do componente, nao global.**
   Racional: seletores prefixados com `app-video` (ex.: `app-video .vjs-progress-control`) para nao vazar para outros players video.js da pagina. `ViewEncapsulation` default (emulated) aplica — confirmar no teste visual que os seletores atravessam para os nos criados pelo video.js dentro do template (estao dentro do host, entao sim).

## Risks / Trade-offs

- [Ordem default dos filhos pode variar com plugins (ex.: VHS/live)] → Mitigacao: spike visual no showcase com mp4 + m3u8; se variar, fixar via opcao `controlBar.children`.
- [CSS acoplado a classes internas `.vjs-*` (ex.: `.vjs-progress-control`, `.vjs-spacer`)] → Mitigacao: video.js mantem essas classes estaveis na v8; prefixar tudo com `app-video` e revisar no bump de major.
- [Emcapsulated CSS vs nos criados em runtime] → Mitigacao: nos sao filhos do host, cobertos pelo emulated; validar no browser, fallback `::ng-deep` documentado se preciso.
- [Budget `anyComponentStyle` 4kB/8kB] → Mitigacao: SCSS enxuto (dezenas de linhas); build acusa se estourar.

## Migration Plan

1. Criar `video.scss` + `styleUrl`, ajustar `video.ts` (so estilos/opcao `controlBar`).
2. Validar visualmente no showcase (2 exemplos existentes: fluido e 640x360 fixo).
3. `ng build` + `tsc`; rollback = reverter o commit.

## Open Questions

- Manter `remainingTimeDisplay`/`liveDisplay` ocultos ou visiveis? Proposta: ocultos no v1 (uso e VOD); facil de religar via CSS.
