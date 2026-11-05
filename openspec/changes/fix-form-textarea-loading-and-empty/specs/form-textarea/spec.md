# Spec Delta

## Purpose

Define o comportamento do campo de texto multilinha de formulário `app-form-textarea`, incluindo estado de carregamento, valor vazio como `null` e ação de limpar.

## ADDED Requirements

### Requirement: Botão de limpar oculto durante o carregamento
O campo SHALL ocultar o botão de limpar enquanto `loading` estiver ativo, e SHALL tornar o conteúdo somente leitura nesse estado.

#### Scenario: Carregamento oculta a ação de limpar
- **WHEN** o campo está com `loading` ativo e possui valor
- **THEN** o botão de limpar não é exibido e o textarea fica somente leitura

#### Scenario: Fim do carregamento restaura a ação
- **WHEN** `loading` é desativado em um campo com valor
- **THEN** o botão de limpar volta a ser exibido

### Requirement: Botão de limpar oculto quando somente leitura ou desabilitado
O campo SHALL ocultar o botão de limpar quando estiver em `readonly` ou desabilitado.

#### Scenario: Campo somente leitura
- **WHEN** o campo é configurado com `readonly` e possui valor
- **THEN** o botão de limpar não é exibido

#### Scenario: Campo desabilitado pelo control
- **WHEN** o `FormControl` é desabilitado
- **THEN** o botão de limpar não é exibido e o textarea fica desabilitado

### Requirement: Valor vazio é nulo no FormControl após digitação
O campo SHALL gravar `null` no `FormControl` quando o usuário apaga todo o conteúdo do textarea.

#### Scenario: Apagar o texto digitado
- **WHEN** o usuário apaga todo o texto do textarea
- **THEN** o valor do `FormControl` passa a ser `null`

### Requirement: Escrita programática vazia é nula sem marcar o campo como alterado
O campo SHALL, ao receber string vazia do `FormControl`, atualizar o valor do `FormControl` para `null` sem alterar o estado pristine.

#### Scenario: Escrita programática de string vazia
- **WHEN** o `FormControl` recebe `''`
- **THEN** o valor do `FormControl` passa a ser `null` e o campo permanece pristine

### Requirement: Limpar restaura o estado inicial
A ação de limpar SHALL definir o valor como `null`, restaurar o estado pristine e untouched, e devolver o foco ao textarea.

#### Scenario: Limpar campo preenchido
- **WHEN** o usuário aciona o botão de limpar em um campo com valor
- **THEN** o valor do `FormControl` é `null`, o campo fica pristine e untouched, e o textarea recebe o foco
