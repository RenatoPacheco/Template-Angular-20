# Spec Delta

## ADDED Requirements

### Requirement: Faixas de legenda multiplas

O sistema SHALL aceitar uma lista de faixas de legenda WebVTT (`src`, `srclang`, `label`, `kind` e `default` opcional) e exibir o botao de legendas quando houver ao menos uma faixa.

#### Scenario: Duas legendas com default

- **WHEN** `tracks` contem pt-BR (default) e en
- **THEN** o player exibe legendas em pt-BR ao iniciar e permite trocar para en pelo botao de legendas.

#### Scenario: Sem faixas

- **WHEN** `tracks` nao e informado ou e vazio
- **THEN** o botao de legendas nao aparece e nada muda no comportamento atual.

#### Scenario: Faixa com URL invalida

- **WHEN** uma faixa aponta para URL inexistente
- **THEN** o player segue reproduzindo sem legendas (ou com as demais faixas validas) e emite `error` com detalhe, sem quebrar.

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
