# Spec Delta

## ADDED Requirements

### Requirement: Interface do player em pt-BR

O sistema SHALL apresentar os controles, menus e textos de acessibilidade do player em portugues do Brasil.

#### Scenario: Controles e menus localizados

- **WHEN** o player e inicializado
- **THEN** botoes, menus de audio/legenda/qualidade, velocidade e mensagens acessiveis usam rotulos em pt-BR, incluindo a opcao `Automático`.

### Requirement: Menu de legendas sem ajustes visuais

O sistema SHALL permitir selecionar ou desativar faixas de legenda sem exibir o item de configuracao visual de legendas do Video.js.

#### Scenario: Menu de legendas

- **WHEN** o usuario abre o menu de legendas
- **THEN** ve as faixas disponiveis e a opcao para desligar legendas, mas nao ve `Subtitle Settings`/`Configurações de legendas`.

### Requirement: Faixas alternativas de audio e legenda HLS

O sistema SHALL expor as faixas alternativas de audio e legenda declaradas pelo manifest HLS nos controles nativos do player, preservando idiomas, rotulos e selecoes default informadas pelo manifest.

#### Scenario: Selecao de audio alternativo

- **WHEN** o manifest HLS declara varias faixas de audio
- **THEN** o controle de audio lista os rotulos/idiomas do manifest e permite trocar a faixa sem reiniciar o video.

#### Scenario: Selecao de legenda alternativa

- **WHEN** o manifest HLS declara varias faixas de legenda
- **THEN** o controle de legendas lista os rotulos/idiomas do manifest, respeita a legenda default e permite selecionar outra faixa ou desligar legendas.

#### Scenario: Manifesto sem faixas alternativas

- **WHEN** o manifest HLS nao declara faixas alternativas
- **THEN** os controles de audio/legenda ficam ocultos ou desabilitados e a reproducao principal continua normal.

### Requirement: Qualidade fixa por rotulo

O sistema SHALL aceitar `quality` como `'auto'` (default, adaptativo do HLS) ou rotulo de nivel (ex.: `'1080p'`, `'720p'`), fixando o nivel do stream HLS sem recarregar a pagina.

#### Scenario: Fixa em 720p

- **WHEN** `quality` e `'720p'` e o manifest oferece esse nivel
- **THEN** o player reproduz o nivel 720p e mantem a posicao atual de reproducao.

#### Scenario: Rotulo inexistente

- **WHEN** `quality` informa rotulo que o manifest nao oferece
- **THEN** o sistema cai para `'auto'` e segue reproduzindo, sem erro fatal.

#### Scenario: Fonte nao-HLS

- **WHEN** a fonte e MP4 progressivo (sem manifest de niveis)
- **THEN** o seletor de qualidade nao aparece e `quality` e ignorado, sem erro.

### Requirement: Menu seletor de qualidade

O sistema SHALL exibir no grupo direito da control bar um menu com `Auto` + niveis do manifest (rotulados por resolucao, ex.: `1080p`, ou `Alta/Media/Baixa` como fallback), refletindo a selecao atual inclusive quando alterada via input.

#### Scenario: Troca pelo menu

- **WHEN** o usuario escolhe `480p` no menu
- **THEN** o nivel fixa em 480p, o menu indica `480p` como atual e a reproducao continua.

#### Scenario: Volta para automatico

- **WHEN** o usuario escolhe `Auto` apos fixar um nivel
- **THEN** o adaptativo do HLS retoma e o menu indica `Auto`.

### Requirement: Diagnostico de interacoes no showcase

O showcase SHALL escrever no console um registro quando o usuario alterar volume, qualidade, faixa de audio, legenda, texto de legenda ou velocidade de reproducao no player HLS de demonstracao. A mudanca de idioma/estado da legenda e a atualizacao do texto devem ser eventos separados.

#### Scenario: Idioma de legenda trocado ou legenda desativada

- **WHEN** o usuario seleciona outra faixa de legenda ou desativa as legendas
- **THEN** `subtitleChange` emite `{ label, language }` para a faixa selecionada ou `null` quando desativada, e o showcase registra essa mudanca no console.

#### Scenario: Texto da legenda atualizado

- **WHEN** as cues ativas da faixa selecionada mudam
- **THEN** `subtitleTextChange` emite o texto ativo (cues simultaneas unidas por newline) ou string vazia para limpar, e o showcase registra o texto no console.

#### Scenario: Outro controle alterado

- **WHEN** o usuario altera volume, qualidade, faixa de audio ou velocidade
- **THEN** o console registra o tipo de controle e seu novo valor ou faixa selecionada.

### Requirement: Estado consolidado do player

O sistema SHALL emitir `stateChange` com um valor do tipo `VideoState` quando o player entrar nos estados `ready`, `playing`, `paused`, `ended` ou `error`, mantendo os outputs especificos `ready`, `ended` e `error`.

#### Scenario: Player pronto e transicoes de reproducao

- **WHEN** o player fica pronto, inicia a reproducao, pausa ou termina
- **THEN** `stateChange` emite, respectivamente, `ready`, `playing`, `paused` ou `ended`.

#### Scenario: Falha de reproducao

- **WHEN** o player emite erro
- **THEN** os outputs `error` e `stateChange` sao emitidos, com `stateChange` igual a `error`.

### Requirement: Comandos publicos de reproducao

O sistema SHALL expor metodos `play()` e `pause()` que executam as respectivas acoes no player; esses nomes SHALL NOT ser outputs de evento.

#### Scenario: Comando play

- **WHEN** o consumidor chama `play()` com o player inicializado
- **THEN** a reproducao e solicitada e `stateChange` emite `playing` quando o player inicia.

#### Scenario: Comando pause

- **WHEN** o consumidor chama `pause()` com o player inicializado
- **THEN** a reproducao e pausada e `stateChange` emite `paused` quando o player pausa.

### Requirement: Eventos direcionais de busca

O sistema SHALL emitir `skipped` quando uma busca termina em uma posicao posterior a anterior e `rewound` quando termina em uma posicao anterior; cada evento SHALL incluir `previousTime` e `currentTime` em segundos.

#### Scenario: Busca para frente

- **WHEN** o usuario avanca a barra de progresso e o seek termina
- **THEN** `skipped` emite os tempos anterior e novo, sem emitir `rewound`.

#### Scenario: Busca para tras

- **WHEN** o usuario retorna a barra de progresso e o seek termina
- **THEN** `rewound` emite os tempos anterior e novo, sem emitir `skipped`.
