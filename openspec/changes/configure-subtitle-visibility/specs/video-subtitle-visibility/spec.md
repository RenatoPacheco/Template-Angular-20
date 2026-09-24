# Spec Delta

## Purpose

Permitir configurar quando o texto das legendas de um player de vídeo fica visível, conforme o modo de apresentação em janela ou tela cheia.

## ADDED Requirements

### Requirement: Visibilidade do texto de legenda configurável

O player SHALL aceitar `subtitleVisibility` com os valores `normal`, `fullscreen`, `hidden` e `windowed`, e aplicar a regra de visibilidade sem alterar a faixa selecionada nem interromper a reprodução.

#### Scenario: Modo normal por padrão

- **WHEN** `subtitleVisibility` não é informado ou vale `normal`
- **THEN** o texto da faixa de legenda ativa permanece visível tanto em janela quanto em tela cheia.

#### Scenario: Visível somente em tela cheia

- **WHEN** `subtitleVisibility` vale `fullscreen`
- **THEN** o texto fica oculto em janela e visível em tela cheia.

#### Scenario: Legendas ocultas

- **WHEN** `subtitleVisibility` vale `hidden`
- **THEN** o texto permanece oculto em janela e em tela cheia, sem desativar a faixa selecionada.

#### Scenario: Visível somente em janela

- **WHEN** `subtitleVisibility` vale `windowed`
- **THEN** o texto fica visível fora de tela cheia e oculto em tela cheia.

#### Scenario: Alteração do modo em runtime

- **WHEN** o valor de `subtitleVisibility` muda enquanto o player está ativo
- **THEN** a visibilidade é atualizada sem recriar o player, recarregar o vídeo ou trocar a faixa selecionada.
