# Proposal

## Why

O `app-video` hoje so reproduz uma fonte por vez — sem legendas e sem controle de qualidade: em HLS (`.m3u8`) o VHS adapta sozinho sem expor escolha, e nao ha como declarar faixas de legenda. Para conteudo multilingue e redes instaveis, ambos sao requisitos de produto.

## What Changes

- Novo input `tracks` no `app-video`: lista de faixas WebVTT (`{ src, srclang, label, kind?, default? }`), repassada a opcao `tracks` do video.js; botao de legendas (captions) aparece automaticamente quando ha faixas; `default: true` seleciona a faixa inicial.
- Novo input `quality` (`'auto' | indice/rotulo`) + menu seletor de qualidade para HLS: modo `auto` (adaptativo do VHS, default) ou nivel fixo (ex.: 1080p, 720p, 480p); troca sem recarregar a pagina e, sempre que possivel, sem perder a posicao atual.
- Mostrador/rotulos de nivel derivados dos metadados do manifest (altura/largura ou BANDWIDTH); com fallback para `Auto/Alta/Media/Baixa` quando o manifest nao expoe resolucao.
- Showcase com exemplo HLS (`.m3u8` multi-nivel) + 2 legendas (pt-BR default, en) e exemplo de qualidade fixa.
- Nova dependencia de plugin de UI para o seletor (ex.: `videojs-hls-quality-selector` ou botao custom sobre a API `qualityLevels` do VHS) — decisao final no design/spike.

## Capabilities

### New Capabilities

(nenhuma — reaproveita `video-player`.)

### Modified Capabilities

- `video-player`: adiciona requisitos de faixas de legenda multiplas e selecao de qualidade HLS. Nota: a spec base de `video-player` esta nas changes `migrate-video-to-app-video` e `custom-video-controls-layout` (nao arquivadas); esta delta soma requisitos via `ADDED` e pressupoe o arquivamento daquelas antes desta.

## Impact

- Afetado: `src/app/shared/ui/video/video.ts` (inputs `tracks`/`quality`, grupos live), `video.scss` (posicao do botao de qualidade no grupo direito), `showcase-video-page` (exemplos HLS+legendas).
- Nova dependencia npm (plugin de seletor) + `@types` correspondente, se o spike confirmar; sem breaking na API existente (inputs novos, todos opcionais).
- Comportamento `src` MP4 inalterado: sem manifest HLS, o seletor de qualidade nao aparece.
