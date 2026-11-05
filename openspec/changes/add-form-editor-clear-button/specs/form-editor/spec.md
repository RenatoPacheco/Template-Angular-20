# Spec Delta

## Purpose

Definir a ação de limpar do campo de texto rico `app-form-editor`, incluindo a disponibilidade do botão nos estados do campo e o efeito da limpeza sobre o valor e o estado do formulário.

## ADDED Requirements

### Requirement: Botão de limpar na barra do editor
O editor habilitado SHALL exibir um botão "Limpar" na barra de ferramentas, tanto no modo básico quanto no modo completo.

#### Scenario: Editor habilitado no modo básico
- **WHEN** o editor está habilitado e é renderizado no modo básico
- **THEN** o botão "Limpar" aparece na barra de ferramentas

#### Scenario: Editor habilitado no modo completo
- **WHEN** o editor está habilitado e é renderizado no modo completo
- **THEN** o botão "Limpar" aparece na barra de ferramentas

### Requirement: Limpar apaga o conteúdo e restaura o estado inicial
A ação de limpar SHALL apagar todo o conteúdo do editor, definir o valor como `null` no `FormControl`, restaurar o estado pristine e untouched, e devolver o foco ao editor.

#### Scenario: Limpar campo preenchido
- **WHEN** o usuário aciona o botão "Limpar" em um editor com conteúdo
- **THEN** o conteúdo do editor fica vazio, o valor do `FormControl` é `null`, o campo fica pristine e untouched, e o editor recebe o foco

### Requirement: Botão de limpar desabilitado durante o carregamento
O botão "Limpar" SHALL ficar desabilitado enquanto `loading` estiver ativo, e a ação SHALL NOT alterar o valor nesse estado.

#### Scenario: Campo em carregamento
- **WHEN** `loading` está ativo
- **THEN** o botão "Limpar" fica desabilitado e o valor não muda ao tentar acioná-lo

#### Scenario: Fim do carregamento
- **WHEN** `loading` é desativado
- **THEN** o botão "Limpar" volta a ficar habilitado

### Requirement: Botão de limpar ausente quando somente leitura ou desabilitado
O editor SHALL NOT exibir o botão "Limpar" quando estiver em `readonly` ou desabilitado.

#### Scenario: Campo somente leitura
- **WHEN** o campo é configurado com `readonly`
- **THEN** a barra de ferramentas não contém o botão "Limpar"

#### Scenario: Campo desabilitado pelo control
- **WHEN** o `FormControl` é desabilitado
- **THEN** a barra de ferramentas não contém o botão "Limpar"
