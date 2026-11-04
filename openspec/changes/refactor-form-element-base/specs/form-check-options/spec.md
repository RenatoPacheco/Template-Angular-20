# Spec Delta

## Purpose

Define o comportamento de checkbox e radio com valor de opção: cada componente representa uma opção, e seu estado marcado é derivado do valor do `FormControl`.

## ADDED Requirements

### Requirement: Valor da opção

Cada checkbox ou radio DEVE aceitar a opção que representa pelo atributo `value`. Esse valor é o que o controle grava no `FormControl` ao ser marcado.

#### Scenario: Opção marcada grava seu valor

- **WHEN** o usuário marca um checkbox com `[value]="'id2'"`
- **THEN** o valor do `FormControl` passa a ser `'id2'`

### Requirement: Estado marcado derivado do modelo

O estado marcado DEVE ser derivado do valor do `FormControl`: a opção fica marcada somente quando o valor do modelo não é `null` e é igual ao valor da opção. Não existe estado marcado independente do modelo.

#### Scenario: Modelo null não marca

- **WHEN** o `FormControl` tem valor `null` e o checkbox tem `[value]="'id1'"`
- **THEN** o checkbox fica desmarcado

#### Scenario: Modelo igual ao valor marca

- **WHEN** o `FormControl` tem valor `'id1'` e o checkbox tem `[value]="'id1'"`
- **THEN** o checkbox fica marcado

#### Scenario: Modelo diferente não marca

- **WHEN** o `FormControl` tem valor `'id2'` e o checkbox tem `[value]="'id1'"`
- **THEN** o checkbox fica desmarcado

#### Scenario: Escrita programática atualiza a opção

- **WHEN** o código chama `control.setValue('id1')` com um checkbox de `[value]="'id1'"` desmarcado
- **THEN** o checkbox fica marcado sem que o `FormControl` fique `dirty`

### Requirement: Desmarcar emite null

Quando o usuário desmarca uma opção, o `FormControl` DEVE receber `null`.

#### Scenario: Desmarcar a opção atual

- **WHEN** o usuário desmarca um checkbox que estava marcado com o valor `'id1'`
- **THEN** o valor do `FormControl` passa a ser `null` e o checkbox fica desmarcado

### Requirement: Radios de um mesmo FormControl

Radios que compartilham o mesmo `FormControl` DEVEM refletir o modelo de forma exclusiva: apenas o radio cujo valor é igual ao modelo fica marcado.

#### Scenario: Troca de opção no grupo

- **WHEN** o usuário marca o radio de valor `'id2'` em um grupo cujo modelo era `'id1'`
- **THEN** o modelo passa a `'id2'`, o radio de `'id2'` fica marcado e o radio de `'id1'` fica desmarcado, sem depender de evento do radio anterior
