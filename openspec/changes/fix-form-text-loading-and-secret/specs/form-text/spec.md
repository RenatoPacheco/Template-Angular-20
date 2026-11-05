# Spec Delta

## Purpose

Define o comportamento do campo de texto de formulário `app-form-text`, incluindo estado de carregamento, modo secreto, valor vazio e botões de ação do campo.

## ADDED Requirements

### Requirement: Botões de ação ocultos durante o carregamento
O campo SHALL ocultar os botões de ação (limpar, mostrar e ocultar) enquanto `loading` estiver ativo.

#### Scenario: Carregamento oculta a ação de limpar
- **WHEN** o campo está com `loading` ativo e possui valor
- **THEN** o botão de limpar não é exibido e o input fica somente leitura

#### Scenario: Fim do carregamento restaura a ação
- **WHEN** `loading` é desativado em um campo com valor
- **THEN** o botão de limpar volta a ser exibido

### Requirement: Botões de ação ocultos quando somente leitura ou desabilitado
O campo SHALL ocultar os botões de ação quando estiver em `readonly` ou desabilitado.

#### Scenario: Campo somente leitura
- **WHEN** o campo é configurado com `readonly` e possui valor
- **THEN** nenhum botão de ação é exibido

#### Scenario: Campo desabilitado pelo control
- **WHEN** o `FormControl` é desabilitado
- **THEN** nenhum botão de ação é exibido e o input fica desabilitado

### Requirement: Modo secreto inicia mascarado para todos os tipos
Quando `control-secret` estiver habilitado, o campo SHALL iniciar com o valor mascarado, independentemente do `type` declarado.

#### Scenario: Secreto em campo de texto
- **WHEN** o campo é `type="text"` com `control-secret` habilitado
- **THEN** o valor é exibido mascarado e o botão oferecido é "mostrar"

#### Scenario: Secreto em campo de e-mail
- **WHEN** o campo é `type="email"` com `control-secret` habilitado
- **THEN** o input é renderizado como `password` e o botão oferecido é "mostrar"

### Requirement: Alternância entre mascarado e revelado
O campo com `control-secret` SHALL alternar entre o modo mascarado e o revelado pelo botão de ação, e ao revelar SHALL usar o `type` declarado.

#### Scenario: Revelar valor
- **WHEN** o usuário aciona "mostrar" em um campo `type="email"` mascarado
- **THEN** o input passa a ser `email` e o botão oferecido passa a ser "ocultar"

#### Scenario: Ocultar novamente
- **WHEN** o usuário aciona "ocultar" em um campo revelado
- **THEN** o input volta a ser `password` e o botão oferecido volta a ser "mostrar"

#### Scenario: Tipo search revelado
- **WHEN** o campo é `type="search"` com `control-secret` revelado
- **THEN** o input é renderizado como `text`

### Requirement: Campo sem control-secret não oferece alternância
Quando `control-secret` não estiver habilitado, o campo SHALL renderizar o `type` declarado e SHALL NOT exibir botões de mostrar ou ocultar.

#### Scenario: Campo password sem control-secret
- **WHEN** o campo é `type="password"` sem `control-secret`
- **THEN** o input é `password` e não há botão de mostrar ou ocultar

### Requirement: Valor vazio é nulo no model
O campo SHALL emitir `null` para o model quando o valor estiver vazio, tanto na digitação quanto na escrita programática.

#### Scenario: Apagar o texto digitado
- **WHEN** o usuário apaga todo o texto do campo
- **THEN** o valor do `FormControl` passa a ser `null`

#### Scenario: Escrita programática vazia
- **WHEN** o `FormControl` recebe `''`
- **THEN** o valor do campo e do `FormControl` é `null`

### Requirement: Limpar restaura estado inicial
A ação de limpar SHALL definir o valor como `null`, restaurar o estado pristine e untouched, devolver o foco ao input e, com `control-secret`, voltar ao modo mascarado.

#### Scenario: Limpar campo revelado
- **WHEN** o usuário limpa um campo `control-secret` que estava revelado
- **THEN** o valor é `null`, o modo volta a mascarado e o input recebe o foco

### Requirement: Máscara de formatação aplicada na digitação
O campo SHALL aplicar a máscara definida em `transform` a cada alteração de valor não vazia.

#### Scenario: CPF formatado durante a digitação
- **WHEN** o usuário digita um CPF com `transform="cpf"`
- **THEN** o input exibe o valor formatado como CPF e o model recebe o valor formatado

### Requirement: Clique no alerta emite erros
Ao clicar no alerta de um campo inválido, o campo SHALL emitir a saída `error` com as mensagens dos erros do controle.

#### Scenario: Campo inválido tocado
- **WHEN** o usuário clica no alerta de um campo com erro de validação
- **THEN** a saída `error` é emitida com uma mensagem para cada erro do controle

### Requirement: Clique na ajuda emite helper
Quando `enabled-helper` estiver habilitado, clicar na ajuda SHALL emitir a saída `helper`.

#### Scenario: Ajuda habilitada
- **WHEN** o usuário clica na ajuda de um campo com `enabled-helper`
- **THEN** a saída `helper` é emitida
