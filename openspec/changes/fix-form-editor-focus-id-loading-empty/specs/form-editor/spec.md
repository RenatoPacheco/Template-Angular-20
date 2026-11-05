# Spec Delta

## Purpose

Definir o comportamento do campo de texto rico de formulário `app-form-editor` quanto a foco, identificação, estado de carregamento e valor vazio.

## ADDED Requirements

### Requirement: Campo marcado como tocado no blur
O editor SHALL marcar o campo como tocado quando o usuário sai do editor, e SHALL NOT marcá-lo como tocado apenas pelo foco.

#### Scenario: Foco não marca como tocado
- **WHEN** o usuário foca o editor sem alterar o conteúdo
- **THEN** o campo permanece não tocado

#### Scenario: Saída do editor marca como tocado
- **WHEN** o usuário sai do editor
- **THEN** o campo é marcado como tocado

### Requirement: Label aponta para o editor em todos os modos
O label do editor SHALL referenciar o id do editor em todos os blocos de renderização, incluindo o modo mobile.

#### Scenario: Modo mobile
- **WHEN** o editor é renderizado no modo mobile
- **THEN** o label aponta para o id do editor renderizado

### Requirement: Clicar no label foca o editor
Clicar no label de um editor habilitado SHALL mover o foco para o editor, e SHALL NOT mover o foco quando o clique ocorrer sobre um ícone de ajuda ou de erro do label.

#### Scenario: Clique no label com editor habilitado
- **WHEN** o usuário clica no label de um editor habilitado
- **THEN** o foco vai para o editor

#### Scenario: Clique no ícone de erro do label
- **WHEN** o usuário clica no ícone de erro do label
- **THEN** o foco não é movido para o editor

### Requirement: Carregamento sinaliza o estado no label
O editor SHALL exibir o indicador de carregamento no label e SHALL ficar somente leitura enquanto `loading` estiver ativo.

#### Scenario: Campo em carregamento
- **WHEN** `loading` está ativo
- **THEN** o label exibe o indicador de carregamento e o conteúdo fica somente leitura

#### Scenario: Fim do carregamento
- **WHEN** `loading` é desativado
- **THEN** o indicador some e o conteúdo volta a ser editável

### Requirement: Conteúdo vazio é nulo no FormControl
O editor SHALL gravar `null` no `FormControl` quando o conteúdo estiver vazio, isto é, quando o valor for string vazia `''`.

#### Scenario: Apagar todo o conteúdo
- **WHEN** o usuário apaga todo o conteúdo do editor e o valor emitido é `''`
- **THEN** o valor do `FormControl` passa a ser `null`

#### Scenario: Escrita programática vazia
- **WHEN** o `FormControl` recebe `''`
- **THEN** o valor do `FormControl` passa a ser `null` e o campo permanece não alterado
