# Spec Delta

## Purpose

Permite configurar múltiplas faixas de legenda em um vídeo e escolher qual delas exibir durante a reprodução, usando metadados claros para cada idioma.

## ADDED Requirements

### Requirement: Configure multiple subtitle tracks
O player SHALL aceitar uma lista opcional de faixas de legenda, cada uma contendo URL do arquivo, sigla do idioma e título de exibição.

#### Scenario: Load configured subtitle tracks
- **WHEN** uma ou mais faixas válidas são fornecidas ao player
- **THEN** cada faixa fica disponível no seletor de legendas com o título e idioma configurados e aponta para a URL informada

#### Scenario: Ignore incomplete subtitle tracks
- **WHEN** uma faixa não possui URL, sigla ou título válido
- **THEN** essa faixa não é disponibilizada no seletor e as demais faixas válidas continuam utilizáveis

### Requirement: Select or disable subtitle tracks
O player SHALL permitir selecionar uma das faixas configuradas ou desativar as legendas durante a reprodução.

#### Scenario: Select a subtitle language
- **WHEN** a pessoa usuária seleciona uma faixa no seletor de legendas
- **THEN** o player exibe essa faixa sincronizada com o vídeo

#### Scenario: Disable subtitles
- **WHEN** a pessoa usuária escolhe a opção de legendas desativadas
- **THEN** nenhuma faixa de legenda é exibida

### Requirement: Configure subtitle tracks in the video showcase
O showcase SHALL permitir adicionar, editar e remover uma ou mais faixas de legenda informando sigla do idioma, URL e título, e disponibilizar a configuração ao player.

#### Scenario: Add multiple subtitle tracks
- **WHEN** a pessoa usuária informa duas ou mais faixas no showcase
- **THEN** todas as faixas válidas são passadas ao player e podem ser selecionadas individualmente

#### Scenario: Update subtitle configuration
- **WHEN** a pessoa usuária altera ou remove faixas configuradas no showcase
- **THEN** a configuração atualizada é refletida no player sem duplicar faixas antigas
