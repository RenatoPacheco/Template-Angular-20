# Proposal

## Why

O player precisa permitir configurar mais de uma faixa de legenda para que a pessoa usuária possa selecionar a faixa adequada durante a reprodução. Atualmente, o showcase e o componente não oferecem uma forma estruturada de informar os metadados de diversas legendas.

## What Changes

- Adicionar suporte a uma lista opcional de faixas de legenda, identificadas por sigla de idioma, URL e título.
- Disponibilizar no showcase controles para informar uma ou mais faixas e enviá-las ao player.
- Preservar a seleção das faixas pelo menu de legendas do Video.js e a funcionalidade de legenda desligada.

## Capabilities

### New Capabilities
- `video-subtitles`: Configuração e seleção de múltiplas faixas de legenda no player de vídeo.

### Modified Capabilities
- Nenhuma.

## Impact

- Componente compartilhado `src/app/shared/ui/video/video.ts` e seus tipos públicos/barrel exports.
- Showcase de vídeo em `src/app/feature/showcases/pages/showcase-video-page/`.
- Integração com faixas de texto remotas do Video.js; não é prevista nova dependência.
