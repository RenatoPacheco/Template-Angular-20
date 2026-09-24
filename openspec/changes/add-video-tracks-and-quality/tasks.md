# Tasks

## 1. Spike e selecao de qualidade HLS

- [x] 1.1 Avaliar `videojs-hls-quality-selector@2` contra video.js v8 + `@types` e contrato; registrar rejeicao porque omite renditions sem resolucao e usa `levels_` privado, escolhendo seletor custom com API publica do MenuButton e qualityLevels
- [x] 1.2 Confirmar que nao e necessaria dependencia npm; verificar `package.json` sem plugin e `npm install` concluido

## 2. Legendas e qualidade no `app-video`

- [x] 2.1 Verificar que o player exibe as faixas de audio e legendas do manifest `public/video/hls.m3u8` via `audioTrackButton`/`subsCapsButton`, preserva defaults e permite troca sem reiniciar; validar no showcase
- [x] 2.2 Adicionar input `quality: 'auto' | string` live (fixa nivel por rotulo via `enabled`, inexistente cai para `auto`, MP4 ignora sem erro), e verificar fixando `480p` (nivel existente no manifest local) via input sem reload e sem perder a posicao
- [x] 2.3 Criar componente MenuButton de qualidade no grupo direito com `Auto` + niveis (`{height}p` ou fallback `Alta/Media/Baixa`), refletindo selecao via input e via menu, e verificar troca nos dois sentidos no showcase HLS
- [x] 2.4 Conectar no showcase eventos de volume, qualidade, faixa de audio, troca/desativacao de legenda, texto de legenda e velocidade a handlers com `console.log`, e verificar registros separados de idioma e texto no console ao interagir com o player HLS
- [x] 2.5 Extrair leitura de tracks, deteccao de troca de faixa e cues de legenda para `src/app/shared/ui/video/video-track-selector.ts`, retornar cleanup dos listeners e verificar com `npx tsc --noEmit -p tsconfig.app.json`
- [x] 2.6 Configurar localidade pt-BR e traducoes para controles, menus e acessibilidade, e verificar visualmente rotulos traduzidos no showcase
- [x] 2.7 Remover `textTrackSettings` dos filhos do Video.js sem remover `subsCapsButton`, e verificar que o menu ainda permite selecionar/desligar legenda mas nao mostra “Subtitle Settings”
- [x] 2.8 Expor `stateChange` tipado por `VideoState` e substituir outputs `play`/`pause` por metodos publicos de comando, manter outputs especificos restantes e ligar o showcase ao estado, verificando TypeScript/build
- [x] 2.9 Emitir `skipped`/`rewound` com `previousTime` e `currentTime` ao completar buscas para frente/tras, ligar logs no showcase e verificar ambos os sentidos

## 3. Verificacao final

- [x] 3.1 Rodar `npx tsc --noEmit -p tsconfig.app.json` e `npx ng build --configuration development`, e verificar build completo sem erros
- [x] 3.2 Validar a change com `openspec validate "add-video-tracks-and-quality" --strict`, e verificar zero erros de spec/design/tasks

_Premissas: rotulos canonicos `{height}p`; manifest HLS do showcase ja fornece qualidades, audios e legendas e referencia playlists remotas com CORS; `quality` opcional, sem breaking._
