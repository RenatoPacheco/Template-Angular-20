# Proposal

## Why

O `app-video` ainda nao expoe selecao de faixas de audio/legenda que ja estao declaradas em manifests HLS e nao permite escolher qualidade: o VHS adapta sozinho sem expor niveis. Para conteudo multilingue e redes instaveis, esses controles sao necessarios.

## What Changes

- Usar as faixas alternativas de audio e legendas declaradas no manifest HLS (`EXT-X-MEDIA`), expondo os controles nativos de selecao do video.js; o manifest define idiomas, rotulos e defaults.
- Novo input `quality` (`'auto' | indice/rotulo`) + menu seletor de qualidade para HLS: modo `auto` (adaptativo do VHS, default) ou nivel fixo (ex.: 1080p, 720p, 480p); troca sem recarregar a pagina e, sempre que possivel, sem perder a posicao atual.
- Mostrador/rotulos de nivel derivados dos metadados do manifest (altura/largura ou BANDWIDTH); com fallback para `Auto/Alta/Media/Baixa` quando o manifest nao expoe resolucao.
- Showcase usa `public/video/hls.m3u8`, que ja declara multiplos niveis de qualidade, audios e legendas; sem criar faixas VTT paralelas.
- Showcase registra no console mudancas de volume, qualidade, faixa de audio, legenda e velocidade.
- O `app-video` expoe `stateChange` com o novo estado tipado (`VideoState`) em eventos de ciclo de vida do player e `skipped`/`rewound` com os tempos anterior e novo ao buscar no video; `play()` e `pause()` sao metodos de comando. **BREAKING**: removidos os outputs `play` e `pause`.
- Interface, botoes, menus e textos de acessibilidade do player ficam em pt-BR.
- Menu de legendas permite selecionar/desativar faixas, sem a opcao “Subtitle Settings”.
- Seletor customizado baseado na API VHS `qualityLevels()` (sem dependencia npm nova).

## Capabilities

### New Capabilities

(nenhuma — reaproveita `video-player`.)

### Modified Capabilities

- `video-player`: adiciona requisitos de faixas de legenda multiplas e selecao de qualidade HLS. Nota: a spec base de `video-player` esta nas changes `migrate-video-to-app-video` e `custom-video-controls-layout` (nao arquivadas); esta delta soma requisitos via `ADDED` e pressupoe o arquivamento daquelas antes desta.

## Impact

- Afetado: `src/app/shared/ui/video/video.ts`, novo `video-track-selector.ts` (eventos e leitura das faixas), `video-quality-selector.ts`, `video.scss`, `showcase-video-page` (usa manifest HLS local existente).
- **BREAKING**: consumidores que ouviam `(play)` ou `(pause)` devem usar `(stateChange)` para observar o estado ou chamar `play()`/`pause()` como comandos.
- Demais inputs e outputs permanecem compativeis.
- Comportamento `src` MP4 inalterado: sem manifest HLS, o seletor de qualidade nao aparece.
