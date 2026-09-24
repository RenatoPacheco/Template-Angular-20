# Tasks

## 1. Spike do seletor de qualidade HLS

- [ ] 1.1 Avaliar plugin de seletor (ex.: `videojs-hls-quality-selector`) contra video.js v8 + `@types` em HLS multi-nivel de teste, e verificar menu `Auto/1080p/720p` funcional sem erros no console (se incompatível, seguir para botao custom sobre `player.qualityLevels()` em task 2.3 alternativa)
- [ ] 1.2 Adicionar a dependencia do plugin (e `@types`, se existir) ao `package.json`, e verificar `npm install` + `npx ng build --configuration development` sem estouro de budget

## 2. Legendas e qualidade no `app-video`

- [ ] 2.1 Adicionar input `tracks: VideoTrack[]` (src/srclang/label/kind/default) repassado a opcao `tracks` no init + sync live via `addRemoteTextTrack`/`removeRemoteTextTrack`, e verificar no showcase 2 legendas (pt-BR default, en) trocaveis pelo botao de captions
- [ ] 2.2 Adicionar input `quality: 'auto' | string` live (fixa nivel por rotulo via `enabled`, inexistente cai para `auto`, MP4 ignora sem erro), e verificar fixando `720p` via input sem reload e sem perder a posicao
- [ ] 2.3 Exibir o menu de qualidade no grupo direito da control bar com `Auto` + niveis (`{height}p` ou fallback `Alta/Media/Baixa`), refletindo selecao via input e via menu, e verificar troca nos dois sentidos no showcase HLS

## 3. Verificacao final

- [ ] 3.1 Rodar `npx tsc --noEmit -p tsconfig.app.json` e `npx ng build --configuration development`, e verificar build completo sem erros
- [ ] 3.2 Validar a change com `openspec validate "add-video-tracks-and-quality" --strict`, e verificar zero erros de spec/design/tasks

_Premissas: rotulos canonicos `{height}p`; exemplo HLS do showcase usa stream publica com CORS; `tracks`/`quality` opcionais, sem breaking._
