# form-error-toast Specification

## Purpose

Garantir que clicar no ícone de alerta de um campo de formulário inválido sempre exiba um toast com as mensagens dos erros, sem que nenhuma chave de erro dos validadores do projeto caia em silêncio.

## Requirements

### Requirement: Toast com as mensagens ao clicar no alerta

Ao clicar no ícone de alerta (`i[role="alert"]` do `label[app-label]`) de um controle inválido, o sistema DEVE exibir um toast de erro contendo uma mensagem para cada erro presente no controle, e emitir a saída `error` com essas mensagens.

#### Scenario: Clique no alerta de campo inválido

- **WHEN** o controle está inválido e o usuário clica no ícone de alerta
- **THEN** um toast de erro é exibido com as mensagens de todos os erros do controle

#### Scenario: Nenhuma chave sem mensagem

- **WHEN** qualquer validador de `src/app/shared/validators/` reprova um valor
- **THEN** a chave retornada em `ValidationErrors` existe no mapa de `ValidatorService.getMessages()`, de modo que o toast nunca é criado vazio

#### Scenario: Campo válido ou sem erros

- **WHEN** o controle não tem erros
- **THEN** clicar no alerta (se visível) não cria toast vazio nem emite saída `error` com lista vazia

### Requirement: Chaves de erro de período e data-hora

Os validadores de período de tempo e de data-hora DEVEM reprovar valores inválidos com as chaves `timeSpan` e `dateTime`, respectivamente — as mesmas chaves do mapa de mensagens.

#### Scenario: TimeSpan inválido notifica

- **WHEN** um `app-form-text` com `transform="timeSpan"` e `CustomValidators.timeSpan()` contém texto inválido e o usuário clica no alerta
- **THEN** o toast exibe a mensagem de período de tempo inválido

#### Scenario: DateTime inválido notifica

- **WHEN** um `app-form-text` com `transform="dateTime"` e `CustomValidators.dateTime()` contém texto inválido e o usuário clica no alerta
- **THEN** o toast exibe a mensagem de data e hora inválida

#### Scenario: Senha curta notifica

- **WHEN** um campo com `CustomValidators.password()` contém menos de 8 caracteres e o usuário clica no alerta
- **THEN** o toast exibe a mensagem de mínimo de caracteres
