# Proposal

## Why

O componente atual `video[app-video]` (`src/app/shared/ui/video/video.ts`) combina tres problemas: `effect()` criado dentro de `ngAfterViewInit` (fora de injection context, erro de runtime NG0608), host bindings (`[attr.src]`, `[attr.autoplay]`, `[attr.controls]`) que brigam com o DOM gerenciado pelo video.js, e `template: ''` que impede multiplas fontes, projecao de `<source>` e qualquer customizacao futura. A decisao de explore foi abandonar a tag nativa como host e adotar um elemento proprio `app-video` com liberdade total de template e API.

## What Changes

- **BREAKING**: seletor muda de `video[app-video]` (atributo) para `app-video` (elemento). Uso antigo `<video app-video ...>` deixa de funcionar.
- Novo `app-video` passa a ser dono do DOM: template proprio com `<video>` interno privado, video.js inicializado apenas sobre esse no interno.
- API recomposta em duas camadas: camada fiel ao video.js (`src`/`sources`, `autoplay`, `controls`, `loop`, `muted`, `preload`, `poster`, `playbackRate`, `playbackRates`, `fluid`) + outputs de ciclo de vida (`ready`, `play`, `pause`, `ended`, `error`).
- Reatividade corrigida: sincronizacao via `effect` em injection context (construtor) ou `ngOnChanges`, com distincao entre opcoes live (atualizam player vivo) e init-only (exigem recria). Sem escrita de volta em atributos do host apos o init.
- Convergencia de convecoes do repo: `transformBoolean` / `transformNumber` de `@app/shared/utils`, prefixo `app`, signals para reatividade zoneless.
- Migracao do unico consumo conhecido: `showcase-video-page.html` para `<app-video>`.

## Capabilities

### New Capabilities

- `video-player`: player de video reutilizavel `app-video` baseado em video.js — declaracao via inputs, eventos via outputs, suporte a fonte unica ou multiplas fontes, taxas de reproducao configuraveis e estados de erro visiveis.

### Modified Capabilities

(nenhuma — nao ha spec existente para video; `form-datepicker` e `form-error-toast` nao sao afetadas.)

## Impact

- Afetado: `src/app/shared/ui/video/video.ts` (reescrita), `src/app/shared/ui/index.ts` (barrel inalterado no nome, muda a classe exportada), `src/app/feature/showcases/pages/showcase-video-page/*` (migracao de uso + exemplos de novas props).
- CSS global do video.js e classe legada `vjs-default-skin` revisados (v8 usa apenas `video-js`).
- Breaking para consumidores externos que usavam `<video app-video>` — migacao mecanica para `<app-video>`.
- Sem mudanca de dependencia (mantem `video.js ^8.23.7` + `@types/video.js`).
