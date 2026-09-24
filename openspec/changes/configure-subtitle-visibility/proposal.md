# Proposal

## Why

O `app-video` exibe a legenda sempre que uma faixa de texto está ativa, mas diferentes layouts precisam controlar essa visibilidade conforme o player esteja em janela ou tela cheia. Um input explícito permite ajustar esse comportamento sem alterar a seleção de idioma nem o carregamento das legendas.

## What Changes

- Adicionar o input `subtitleVisibility` com valores `normal`, `fullscreen`, `hidden` e `windowed`; default `normal` preserva a exibição atual.
- `fullscreen` exibe o texto apenas em tela cheia; `windowed` apenas fora dela; `hidden` oculta em ambos os modos.
- Aplicar mudanças do input ao player já inicializado, sem recriar o player, recarregar o vídeo ou alterar a seleção de faixa.
- Manter os controles de seleção/desativação de faixas independentes da visibilidade do texto renderizado.

## Capabilities

### New Capabilities

- `video-subtitle-visibility`: configuração da visibilidade da legenda renderizada conforme o modo de apresentação do player.

### Modified Capabilities

(nenhuma — não há capability durável de vídeo em `openspec/specs/`; mudanças anteriores de `video-player` ainda são changes não arquivadas.)

## Impact

- Afetado: `src/app/shared/ui/video/video.ts` e `src/app/shared/ui/video/video.scss`.
- API aditiva: novo input `subtitleVisibility`; sem breaking changes e sem novas dependências.
- Showcase pode demonstrar os quatro modos para verificação manual.
