# Proposal

## Why

O player `app-video` usa a control bar padrao do video.js (linha unica, ordem fixa da lib). O produto precisa de um layout proprio em 2 linhas — progresso isolado em cima e controles agrupados embaixo (essenciais a esquerda, secundarios a direita) — para hierarquia visual e espaco de toque maiores.

## What Changes

- Control bar do `app-video` passa a ter 2 linhas: linha 1 so com a barra de progresso (`progressControl` full-width); linha 2 com os demais controles divididos em grupo esquerdo e grupo direito.
- Grupo esquerdo: play/pause (`playToggle`), volume (`volumePanel`) e indicacao de tempo `atual / total` (`currentTimeDisplay` + `timeDivider` + `durationDisplay`).
- Grupo direito: demais controles default (taxa de reproducao, fullscreen, picture-in-picture quando disponiveis).
- Layout via CSS proprio do componente (`video.scss`), sem manipular DOM do player por JS e sem forkar a skin do video.js.
- Sem mudanca na API de inputs/outputs do `app-video`.

## Capabilities

### New Capabilities

(nenhuma — reaproveita `video-player`.)

### Modified Capabilities

- `video-player`: adiciona o requisito de layout customizado da control bar em 2 linhas com grupos esquerda/direita. Nota: a spec base de `video-player` ainda esta na change `migrate-video-to-app-video` (nao arquivada); esta delta soma requisitos novos via `ADDED` e pressupoe o arquivamento daquela change antes desta.

## Impact

- Afetado: `src/app/shared/ui/video/` (novo `video.scss` + `styleUrl` no componente; possivel opcao `controlBar` no init para fixar ordem dos filhos).
- Showcase: `showcase-video-page` ganha demonstracao visual do novo layout (sem mudanca de API).
- Sem novas dependencias; sem breaking (layout e interno ao componente).
