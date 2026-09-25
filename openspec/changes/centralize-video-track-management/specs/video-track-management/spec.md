# Spec Delta

## Purpose

Centraliza o controle das faixas do player para oferecer comportamento consistente e permitir acrescentar novos tipos no futuro, iniciando com legendas, navegação por capítulos, emissão dos cues de metadata e utilitários para arquivos WebVTT.

## ADDED Requirements

### Requirement: Configure and update subtitle tracks
O player SHALL aceitar zero ou mais faixas de legenda com URL, sigla de idioma e título, disponibilizando as faixas válidas para seleção durante a reprodução.

#### Scenario: Select a configured subtitle
- **WHEN** a pessoa usuária seleciona uma faixa de legenda configurada
- **THEN** o player exibe os cues sincronizados com o vídeo e informa a faixa selecionada pelos eventos já existentes

#### Scenario: Disable subtitles
- **WHEN** a pessoa usuária seleciona legendas desativadas
- **THEN** o player deixa de exibir cues de legenda e emite a mudança de seleção existente

#### Scenario: Update configured subtitles
- **WHEN** a lista de legendas é alterada ou removida enquanto o player está ativo
- **THEN** o seletor reflete a lista atualizada sem duplicar faixas antigas nem remover faixas que não pertencem à configuração do componente

### Requirement: Configure chapter tracks
O player SHALL aceitar zero ou mais faixas de capítulos com URL, sigla de idioma e título e disponibilizar os capítulos válidos na navegação de capítulos do player.

#### Scenario: Navigate using a configured chapter track
- **WHEN** uma faixa de capítulos válida contém cues e a pessoa usuária seleciona um capítulo
- **THEN** o player navega para o intervalo de tempo indicado pelo cue selecionado

#### Scenario: Update configured chapters
- **WHEN** as faixas de capítulos são alteradas ou removidas enquanto o player está ativo
- **THEN** a navegação de capítulos usa somente a configuração atual e não apresenta capítulos duplicados da configuração anterior

### Requirement: Configure metadata tracks and emit cues
O player SHALL aceitar zero ou mais faixas de metadata com URL, sigla de idioma e título, mantê-las sem exibição visual e emitir ao consumidor os cues ativos com a identificação da faixa.

#### Scenario: Emit metadata cues
- **WHEN** uma faixa metadata válida ativa um ou mais cues durante a reprodução
- **THEN** o player emite `metadataCueChange` com o título, idioma e cues ativos da faixa

#### Scenario: Update configured metadata tracks
- **WHEN** as faixas metadata são alteradas ou removidas enquanto o player está ativo
- **THEN** o consumidor recebe cues somente das faixas atuais, sem duplicatas nem remoção de faixas que não pertencem à configuração do componente

#### Scenario: Keep metadata visually hidden
- **WHEN** uma faixa metadata é carregada ou um de seus cues fica ativo
- **THEN** o conteúdo do cue não é renderizado como legenda nem adicionado à navegação de capítulos

### Requirement: Preserve track change notifications
O player SHALL preservar os eventos públicos existentes de seleção de faixa de áudio e de legenda enquanto as faixas são gerenciadas.

#### Scenario: Report audio and subtitle changes
- **WHEN** a faixa de áudio ou legenda ativa muda
- **THEN** o evento correspondente informa a faixa selecionada ou `null` quando nenhuma está selecionada

### Requirement: Configure metadata tracks in the video showcase
O showcase SHALL permitir adicionar, editar e remover faixas metadata informando URL, sigla e título, e SHALL exibir ou registrar os cues recebidos do player.

#### Scenario: Configure multiple metadata tracks
- **WHEN** a pessoa usuária configura uma ou mais faixas metadata válidas
- **THEN** a lista é repassada ao player e os cues ativos chegam ao showcase com o título e idioma da faixa

### Requirement: Group track controls in a dedicated showcase section
O showcase SHALL agrupar os controles de faixas de legendas, capítulos e metadata em uma seção exclusiva, separada das opções gerais do player.

#### Scenario: Find track settings separately
- **WHEN** a pessoa usuária consulta os controles do showcase
- **THEN** encontra as configurações de legendas, capítulos e metadata agrupadas em “Faixas do vídeo”, fora da seção de opções gerais do player

### Requirement: Parse and serialize WebVTT data
O sistema SHALL fornecer a classe `VideoVtt` para converter conteúdo WebVTT em cues normalizados e serializar cues normalizados de volta para conteúdo WebVTT válido.

#### Scenario: Parse a WebVTT file
- **WHEN** conteúdo WebVTT válido com cabeçalho, tempos e textos de cue é fornecido
- **THEN** `VideoVtt` retorna os tempos, identificadores opcionais e textos dos cues sem alterar o conteúdo textual dos cues

#### Scenario: Reject malformed WebVTT data
- **WHEN** o conteúdo não possui estrutura WebVTT válida ou contém tempos de cue inválidos
- **THEN** `VideoVtt` informa erro de parsing em vez de descartar silenciosamente os dados inválidos

#### Scenario: Serialize normalized cues
- **WHEN** uma lista de cues normalizados é serializada
- **THEN** o resultado começa com o cabeçalho `WEBVTT` e contém tempos e textos representados em formato WebVTT válido

### Requirement: Create a downloadable WebVTT Blob
`VideoVtt` SHALL criar um `Blob` com MIME type `text/vtt` a partir dos cues serializados, sem depender de acesso ao filesystem.

#### Scenario: Create a Blob for browser use
- **WHEN** cues válidos são convertidos em arquivo WebVTT
- **THEN** o resultado é um `Blob` `text/vtt` com o conteúdo WebVTT serializado e utilizável por APIs de browser para download
