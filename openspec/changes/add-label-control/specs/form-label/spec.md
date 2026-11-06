# Spec Delta

## Purpose

Definir o rótulo de campos e grupos de `shared/ui`, com texto, indicadores de carregamento, ajuda e erro, estado visual de validação e vínculo opcional com um `FormControl` para exibir o erro sem depender do componente de campo.

## ADDED Requirements

### Requirement: Texto do rótulo

O label SHALL exibir o valor da propriedade `text` quando não houver conteúdo projetado, e o conteúdo projetado quando houver.

#### Scenario: Texto por propriedade

- **WHEN** o label recebe `text="Nome"` e nenhum conteúdo projetado
- **THEN** o texto "Nome" é exibido

#### Scenario: Conteúdo projetado tem prioridade

- **WHEN** o label recebe conteúdo projetado e também a propriedade `text`
- **THEN** o conteúdo projetado é exibido e a propriedade `text` é ignorada

### Requirement: Vínculo com o campo

O label SHALL aplicar a propriedade `for` como atributo `for` do host, para associar o rótulo ao campo de id correspondente.

#### Scenario: Atributo for aplicado

- **WHEN** o label recebe `for="campo-1"`
- **THEN** o host tem o atributo `for` com o valor "campo-1"

### Requirement: Indicador de carregamento

O label SHALL exibir um indicador de carregamento enquanto a propriedade `loading` for verdadeira.

#### Scenario: Carregando

- **WHEN** o label recebe `loading` verdadeiro
- **THEN** o indicador de carregamento aparece antes do texto

#### Scenario: Carregamento encerrado

- **WHEN** o label recebe `loading` falso
- **THEN** o indicador de carregamento não aparece

### Requirement: Ícone de ajuda

O label SHALL exibir um ícone de ajuda quando `enabled-helper` for verdadeiro, e emitir a saída `helper` ao clicar nele ou ao pressionar Enter sobre ele.

#### Scenario: Clique na ajuda

- **WHEN** `enabled-helper` é verdadeiro e o usuário clica no ícone de ajuda
- **THEN** a saída `helper` é emitida

#### Scenario: Ajuda desabilitada

- **WHEN** `enabled-helper` é falso
- **THEN** o ícone de ajuda não aparece

### Requirement: Estado visual por propriedade

O label SHALL aplicar a classe `is-invalid` quando a propriedade `state` for `'invalid'`, e a classe `is-valid` quando for `'valid'`. Com `state` nulo, nenhuma das duas classes é aplicada.

#### Scenario: Estado inválido

- **WHEN** o label recebe `state="invalid"`
- **THEN** o host recebe a classe `is-invalid`

#### Scenario: Estado válido

- **WHEN** o label recebe `state="valid"`
- **THEN** o host recebe a classe `is-valid`

#### Scenario: Sem estado

- **WHEN** o label recebe `state` nulo e não recebe `control`
- **THEN** o host não recebe `is-invalid` nem `is-valid`

### Requirement: Erro a partir de um controle

Quando o label recebe `control`, o erro SHALL ser visível somente se o controle estiver inválido, tiver sido tocado, tiver sido alterado (não pristine) e `enabled-error` for verdadeiro. Nesse caso o ícone de erro aparece e o host recebe `is-invalid`.

#### Scenario: Erro visível após interação

- **WHEN** o label recebe um controle inválido, tocado e alterado, com `enabled-error` verdadeiro
- **THEN** o ícone de erro aparece e o host recebe `is-invalid`

#### Scenario: Erro oculto antes da interação

- **WHEN** o label recebe um controle inválido que ainda não foi tocado
- **THEN** o ícone de erro não aparece e o host não recebe `is-invalid`

#### Scenario: Erro acompanha o controle

- **WHEN** o controle recebido passa de válido para inválido após ser tocado e alterado
- **THEN** o ícone de erro aparece sem nova ação sobre o label

#### Scenario: Troca de controle

- **WHEN** o label passa a receber outro controle
- **THEN** o erro reflete somente o novo controle, e o controle anterior deixa de influenciar o label

### Requirement: Precedência do estado explícito

Quando `state` não for nulo, o label SHALL usar o valor de `state` e ignorar o estado calculado a partir de `control`.

#### Scenario: Estado explícito sobre o controle

- **WHEN** o label recebe `state="valid"` e um controle inválido, tocado e alterado
- **THEN** o host recebe `is-valid` e não recebe `is-invalid`

### Requirement: Clique no alerta sem controle

Quando o label não recebe `control`, o clique no ícone de erro SHALL emitir somente a saída `error`, sem gerar toast, para que o componente pai decida como tratá-lo.

#### Scenario: Pai trata o erro

- **WHEN** o label não recebe `control` e o usuário clica no ícone de erro
- **THEN** a saída `error` é emitida e o label não cria toast
