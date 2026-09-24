# Spec Delta

## ADDED Requirements

### Requirement: Control bar em duas linhas

O sistema SHALL renderizar a control bar do `app-video` em duas linhas: a primeira linha contem apenas a barra de progresso ocupando toda a largura; a segunda linha contem os demais controles.

#### Scenario: Barra de progresso isolada

- **WHEN** o player exibe a control bar
- **THEN** a barra de progresso ocupa 100% da largura na linha superior e responde a clique/arrasto para buscar (seek).

#### Scenario: Segunda linha com controles

- **WHEN** o player exibe a control bar
- **THEN** todos os controles exceto o progresso estao na linha inferior, visiveis e operaveis.

### Requirement: Grupo esquerdo da segunda linha

O sistema SHALL posicionar no grupo esquerdo da segunda linha, nesta ordem: controle de play/pause, controle de volume e indicacao de tempo no formato `tempo atual / tempo total`.

#### Scenario: Composicao do grupo esquerdo

- **WHEN** o player exibe a control bar
- **THEN** a esquerda estao play/pause, volume e o tempo `atual / total` (ex.: `01:12 / 05:00`), e o tempo atual atualiza durante a reproducao.

### Requirement: Grupo direito da segunda linha

O sistema SHALL posicionar no grupo direito da segunda linha os demais controles disponiveis (taxa de reproducao, fullscreen e picture-in-picture quando suportados), alinhados a direita.

#### Scenario: Composicao do grupo direito

- **WHEN** o player exibe a control bar
- **THEN** a direita estao os controles secundarios, e nenhum controle essencial (play, volume, tempo, progresso) aparece nesse grupo.

### Requirement: Comportamento responsivo do layout

O sistema SHALL manter as duas linhas e os dois grupos em qualquer largura do player, sem sobreposicao de controles e sem regressao da reproducao.

#### Scenario: Player estreito

- **WHEN** o player e renderizado em largura pequena (ex.: 320px)
- **THEN** as duas linhas e os grupos permanecem sem sobreposicao (controles secundarios podem colapsar conforme a skin, mas play, progresso e tempo seguem usaveis).
