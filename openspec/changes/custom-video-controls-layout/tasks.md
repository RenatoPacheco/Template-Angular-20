# Tasks

## 1. Layout da control bar em 2 linhas

- [ ] 1.1 Criar `src/app/shared/ui/video/video.scss` com as 2 linhas (progresso full-width na linha 1 via `flex-wrap`/`order`/`flex-basis`, grupos esquerda/direita na linha 2) prefixando todos os seletores com `app-video`, e verificar visualmente no showcase que o progresso ocupa a linha superior inteira e e clicavel/arrastavel
- [ ] 1.2 Alinhar grupo esquerdo (play/pause, volume, tempo `atual / total`) e grupo direito (taxa de reproducao, fullscreen, PiP) com o `spacer` default ou `margin-left: auto`, fixando a ordem via opcao `controlBar` no `videojs()` somente se a ordem default variar, e verificar a ordem exata dos controles na linha 2 em ambos os exemplos do showcase
- [ ] 1.3 Ligar o `video.scss` ao componente via `styleUrl: './video.scss'` sem alterar inputs/outputs, e verificar com `npx tsc --noEmit -p tsconfig.app.json` sem erros e sem estouro do budget `anyComponentStyle` (4kB warning / 8kB error)

## 2. Verificacao final

- [ ] 2.1 Validar largura estreita (ex.: 320px) sem sobreposicao de controles e com play/progresso/tempo usaveis, e verificar por inspecao visual responsiva nos dois exemplos do showcase
- [ ] 2.2 Rodar `npx tsc --noEmit -p tsconfig.app.json` e `npx ng build --configuration development`, e verificar build completo sem erros
- [ ] 2.3 Validar a change com `openspec validate "custom-video-controls-layout" --strict`, e verificar zero erros de spec/design/tasks

_Premissa (de `design.md` Open Questions): `remainingTimeDisplay`/`liveDisplay` ocultos no v1 (uso VOD)._
