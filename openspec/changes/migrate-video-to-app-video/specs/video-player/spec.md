# Spec Delta

## Purpose

Fornecer um player de video reutilizavel `app-video` baseado em video.js, declarado via inputs Angular e observavel via outputs, substituindo o atual atributo `video[app-video]`.

## ADDED Requirements

### Requirement: Uso como elemento proprio

O sistema SHALL oferecer o player como o elemento `app-video`, que encapsula internamente o `<video>` gerenciado pelo video.js.

#### Scenario: Renderizacao basica

- **WHEN** o consumidor declara `<app-video src="https://exemplo.com/a.mp4">`
- **THEN** o sistema renderiza um player video.js funcional com a fonte informada e controles visiveis por padrao.

#### Scenario: Seletor antigo nao suportado

- **WHEN** o consumidor tenta usar `<video app-video>`
- **THEN** o sistema nao reconhece mais esse seletor (breaking change documentada com migracao para `<app-video>`).

### Requirement: Fonte unica obrigatoria ou lista de fontes

O sistema SHALL exigir `src` quando `sources` nao for informado, e SHALL aceitar `sources` como lista ordenada de alternativas com tipo MIME.

#### Scenario: Fonte unica

- **WHEN** apenas `src` e informado
- **THEN** o player carrega essa fonte com o tipo MIME inferido da extensao (mp4, webm, m3u8).

#### Scenario: Multiplas fontes

- **WHEN** `sources` e informado com duas ou mais entradas
- **THEN** o player recebe as fontes na ordem dada e seleciona a primeira reproduzivel.

#### Scenario: Nenhuma fonte

- **WHEN** nem `src` nem `sources` sao informados
- **THEN** o sistema emite `error` e exibe estado de erro em vez de player vazio.

### Requirement: Atributos nativos do video como inputs

O sistema SHALL expor `autoplay`, `controls`, `loop`, `muted`, `preload` e `poster` como inputs com semantica booleana Angular (atributo presente sem valor equivale a `true`).

#### Scenario: Defaults

- **WHEN** nenhum desses inputs e informado
- **THEN** o player usa `controls=true`, `autoplay=false`, `loop=false`, `muted=false`, `preload=metadata`, sem poster.

#### Scenario: Atributo booleano estatico

- **WHEN** o consumidor escreve `<app-video muted loop src="...">`
- **THEN** o player inicia com som desligado e repeticao ativada.

### Requirement: Taxas de reproducao

O sistema SHALL expor `playbackRate` (taxa atual) e `playbackRates` (opcoes do menu), normalizando valores invalidos para `1` / `[1]` sem quebrar.

#### Scenario: Taxa valida

- **WHEN** `playbackRate` e `1.5` e `playbackRates` contem `1.5`
- **THEN** o player reproduz a `1.5x` e o menu lista as opcoes ordenadas sem duplicadas.

#### Scenario: Taxa invalida

- **WHEN** `playbackRate` e `0`, negativo, `NaN` ou ausente de `playbackRates`
- **THEN** o player cai para `1x` (ou primeira opcao valida se `1` nao existir) e continua funcional.

#### Scenario: Lista invalida

- **WHEN** `playbackRates` e vazia ou so com valores invalidos
- **THEN** o menu oferece apenas `[1]`.

### Requirement: Atualizacao reativa live vs init-only

O sistema SHALL atualizar ao vivo `src`/`sources`, `controls`, `autoplay`, `loop`, `muted` e `playbackRate` sem recriar o player, e SHALL tratar `playbackRates`, `fluid` e `aspectRatio` como init-only documentadas.

#### Scenario: Troca de fonte ao vivo

- **WHEN** `src` muda apos o player pronto
- **THEN** o player troca a fonte uma unica vez, sem duplo carregamento, mantendo a taxa atual.

#### Scenario: Opcao init-only alterada

- **WHEN** `playbackRates` muda apos o init
- **THEN** o comportamento documentado e que o menu so reflete na proxima criacao (ou recriacao explicita), sem estado inconsistente.

### Requirement: Eventos observaveis

O sistema SHALL emitir `ready` quando o player estiver pronto, `error` em falha de carga/stream, e eventos de reproducao (`play`, `pause`, `ended`).

#### Scenario: Stream com erro

- **WHEN** a fonte retorna 404 ou formato nao suportado
- **THEN** o sistema emite `error` com detalhe e mantem o componente montado (sem throw nao tratado).

#### Scenario: Ciclo de reproducao

- **WHEN** o usuario da play, pausa e o video termina
- **THEN** o sistema emite `play`, `pause` e `ended` respectivamente.

### Requirement: Acessibilidade e layout

O sistema SHALL renderizar com a classe `video-js` (sem a legada `vjs-default-skin`), manter comportamento `fluid`/responsivo configuravel e nao quebrar sem CSS global.

#### Scenario: Sem CSS global

- **WHEN** o CSS do video.js nao foi carregado
- **THEN** o video continua reproduzivel (apenas sem skin), sem erro de JS.
