# Proposal

## Why

O componente `Video` atualmente divide a gestão de faixas: observa eventos de áudio e legendas por meio de uma função utilitária e adiciona/remova faixas remotas diretamente no componente. Centralizar esse ciclo de vida em uma classe dedicada facilitará a evolução do player para novos tipos de faixa, começando por legendas, capítulos e metadata.

## What Changes

- Renomear `video-track-selector.ts` para `video-track.ts` e expor nele a classe `VideoTrack`, responsável por centralizar a criação, atualização, observação e remoção das faixas usadas pelo player.
- Manter o suporte atual a múltiplas faixas de legenda e delegar sua gestão à classe.
- Permitir configurar faixas de capítulos por URL, sigla de idioma e título, usando a navegação de capítulos integrada ao player.
- Permitir configurar faixas de metadata por URL, sigla de idioma e título, mantendo-as ocultas visualmente e emitindo os cues ativos para o consumidor do componente.
- Expor no showcase a configuração de faixas de legendas, capítulos e metadata, incluindo a observação dos cues, em uma seção exclusiva “Faixas do vídeo” separada das opções gerais do player.
- Preservar os contratos existentes de seleção e eventos de legenda/áudio.

## Capabilities

### New Capabilities
- `video-track-management`: Gerenciamento centralizado de faixas no player de vídeo, incluindo legendas, capítulos e metadata.

### Modified Capabilities
- Nenhuma. Não há specs principais existentes para vídeo; o change anterior de faixas de legenda está concluído, mas ainda não foi arquivado em `openspec/specs/`.

## Impact

- `src/app/shared/ui/video/video-track.ts` e `video.ts`.
- Tipos e entradas públicas do componente compartilhado `Video`.
- Showcase de vídeo em `src/app/feature/showcases/pages/showcase-video-page/`.
- API de faixas remotas, eventos de cues metadata e controles de capítulos do Video.js; nenhuma nova dependência prevista.
