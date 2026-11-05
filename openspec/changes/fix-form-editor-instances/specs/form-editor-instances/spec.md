# Spec Delta

## Purpose

Definir o ciclo de vida das instâncias do editor de texto rico `app-form-editor`, incluindo criação, troca de modo, destruição e a operação de maximizar, sem recarregar a página por falha em um editor.

## ADDED Requirements

### Requirement: Instância destruída deixa de ser operada
O editor SHALL remover de sua lista de instâncias qualquer editor que tenha sido destruído, e SHALL NOT executar operações sobre ele.

#### Scenario: Troca de modo remove a instância anterior
- **WHEN** o editor troca de bloco de renderização e o editor anterior é destruído
- **THEN** a operação de maximizar não é executada sobre o editor destruído

#### Scenario: Destruição do componente libera as instâncias
- **WHEN** o componente `app-form-editor` é destruído
- **THEN** nenhuma instância do componente permanece na lista de editores

### Requirement: Falha em um editor não recarrega a página
Ao operar a ação de maximizar, uma falha em um editor SHALL ser contida a esse editor, e SHALL NOT recarregar a página.

#### Scenario: Editor com erro ao maximizar
- **WHEN** a operação de maximizar lança erro em um dos editores
- **THEN** a página não é recarregada e os demais editores continuam operáveis

### Requirement: Maximizar é fechado ao voltar na navegação
O editor SHALL sair do modo maximizado quando a navegação do navegador é retornada, e SHALL manter a página atual sem navegar para a página anterior enquanto houver editor maximizado.

#### Scenario: Voltar na navegação com editor maximizado
- **WHEN** o usuário aciona voltar do navegador com um editor maximizado
- **THEN** o editor sai do modo maximizado

#### Scenario: Voltar mantém a página atual
- **WHEN** o usuário aciona voltar do navegador com um editor maximizado
- **THEN** a página atual permanece exibida e a página anterior não é carregada
