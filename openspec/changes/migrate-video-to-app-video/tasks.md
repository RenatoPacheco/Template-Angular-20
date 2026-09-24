# Tasks

## 1. Reescrita do componente `app-video`

- [ ] 1.1 Reescrever `src/app/shared/ui/video/video.ts` com seletor `app-video`, template proprio com `<video #target class="video-js">` e remover host bindings `[attr.src]/[attr.autoplay]/[attr.controls]` e classe legada `vjs-default-skin`, e verificar com `npx tsc --noEmit -p tsconfig.app.json` sem erros
- [ ] 1.2 Adicionar inputs `src`, `sources`, `autoplay`, `controls`, `loop`, `muted`, `preload`, `poster`, `playbackRate`, `playbackRates`, `fluid` com `transformBoolean`/`transformNumber` de `@app/shared/utils` e normalizacao de taxas, e verificar via showcase com atributo estatico (`<app-video muted loop>`) aplicando corretamente
- [ ] 1.3 Mover sincronizacao para injection context (effect no construtor com guard `player == null` + `untracked`, ou `ngOnChanges`), inicializar `currentSource` com `src` inicial e dispor em `ngOnDestroy`, e verificar abrindo o showcase sem erro NG0608 no console
- [ ] 1.4 Separar opcoes live (`src/sources`, `controls`, `autoplay`, `loop`, `muted`, `playbackRate`) de init-only (`playbackRates`, `fluid`) e estender `getMimeType` para mp4/webm/m3u8 com default `video/mp4`, e verificar trocando `src` ao vivo com apenas um request na aba Network
- [ ] 1.5 Adicionar outputs `ready`, `play`, `pause`, `ended`, `error` ligados aos eventos do video.js e manter componente montado em falha, e verificar forçando fonte 404 e observando emissao de `error`

## 2. Migracao do showcase e estilos

- [ ] 2.1 Migrar `src/app/feature/showcases/pages/showcase-video-page/showcase-video-page.html` de `<video app-video>` para `<app-video>` com exemplos de fonte unica, `playbackRate(s)` e `error`, e verificar renderizacao do player com controles
- [ ] 2.2 Revisar CSS global do video.js (`angular.json`/`src/styles.scss`, `video.js/dist/video-js.css`) e confirmar skin aplicada, e verificar visualmente que o player nao renderiza sem estilo

## 3. Verificacao final

- [ ] 3.1 Rodar `npx tsc --noEmit -p tsconfig.app.json` e `npx ng build --configuration development`, e verificar build completo sem erros
- [ ] 3.2 Validar a change com `openspec validate --change migrate-video-to-app-video --strict`, e verificar zero erros de spec/design/tasks

_Notas de premissas (de `design.md` Open Questions): `fluid` default `true` para preservar layout atual; sem API imperativa (`play()`/`pause()` publicos) neste v1._
