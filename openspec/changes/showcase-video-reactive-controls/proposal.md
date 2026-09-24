# Proposal

## Why

O showcase de vídeo exibe vários players estáticos, enquanto os recursos mais recentes do `app-video` ficam difíceis de testar a partir de uma página única. Concentrar a demonstração no HLS com várias faixas e oferecer um formulário reativo torna possível explorar e validar o player sem editar o template.

## What Changes

- Remover os três vídeos atuais que antecedem o player HLS e deixar o HLS local `/video/hls.m3u8` como único player.
- Colocar abaixo dele um formulário reativo com controles para todos os inputs do `app-video`: `src`, `sources`, `quality`, `autoplay`, `controls`, `loop`, `muted`, `preload`, `poster`, `playbackRate`, `playbackRates`, `fluid`, `width`, `height` e `subtitleVisibility`.
- Usar controles estruturados editáveis para listas `sources` e `playbackRates`, incluindo adicionar/remover itens e escolher se o player recebe `src` ou `sources`.
- Incluir botões para executar os métodos públicos `play()` e `pause()` e para reinicializar o player.
- Atualizar os inputs ao vivo conforme o formulário muda. As opções init-only `fluid` e `playbackRates` aplicam-se ao clicar em “Reinicializar player”, que recria o player e reinicia a reprodução.
- Manter os logs existentes de eventos do player para facilitar inspeção no console.

## Capabilities

### New Capabilities

Nenhuma — a mudança afeta apenas a página de showcase, sem alterar o contrato do player. `.openspec.yaml` declara `skip_specs: true`.

### Modified Capabilities

Nenhuma.

## Impact

- Afetado: `src/app/feature/showcases/pages/showcase-video-page/showcase-video-page.ts` e `.html`.
- Depende das entradas e métodos já expostos por `Video`; não requer dependências novas nem altera o comportamento de outras páginas.
