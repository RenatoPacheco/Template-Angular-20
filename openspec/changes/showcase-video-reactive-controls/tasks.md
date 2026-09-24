# Tasks

## 1. Showcase com um único player

- [x] 1.1 Remover os três players MP4 e conservar somente o player HLS `/video/hls.m3u8`, verificando que continua carregando áudio, legendas e níveis de qualidade do manifest
- [x] 1.2 Adicionar formulário reativo abaixo do player e importar `ReactiveFormsModule`, verificando a renderização responsiva dos grupos de campos

## 2. Controles reativos do player

- [x] 2.1 Criar `FormGroup` para `src`/`sources` e modo de fonte; fornecer `FormArray` de linhas editáveis `src`/`type` para `sources`, verificando alternância entre fonte simples e lista; aplicar mudanças de URL ao sair do campo para evitar reload por tecla
- [x] 2.2 Adicionar campos para `quality`, `autoplay`, `controls`, `loop`, `muted`, `preload`, `poster`, `playbackRate`, `width`, `height` e `subtitleVisibility`, vinculando valores live ao player e verificando sua atualização
- [x] 2.3 Fornecer `FormArray` editável para `playbackRates` e campo para `fluid`; aplicar esses valores init-only somente ao pressionar “Reinicializar player”, verificando que a reconstrução aplica as opções e reinicia o vídeo
- [x] 2.4 Adicionar botões que invoquem `play()` e `pause()` no player atual, verificando os estados resultantes por `stateChange`
- [x] 2.5 Preservar os listeners/logs existentes de volume, qualidade, áudio, legenda, texto, velocidade, estado, avanço e retorno; sincronizar alterações de qualidade/velocidade dos menus nativos nos campos sem ciclo de atualização e verificar os logs no console

## 3. Verificação

- [x] 3.1 Rodar `npx tsc --noEmit -p tsconfig.app.json` e `npx ng build --configuration development`, verificando compilação sem erros
- [x] 3.2 Testar no showcase cada input, lista editável, botão de reprodução e aplicação das opções init-only, verificando o comportamento correspondente do player HLS
