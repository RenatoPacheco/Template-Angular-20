# form-select-multiple

## ADDED Requirements

### Requirement: Seleção múltipla ligada a formulários Angular

O componente `app-form-select-multiple` DEVE funcionar como um
`ControlValueAccessor`, herdando de `FormElementBase<T[]>`, permitindo
seleção de zero ou mais itens de uma lista de opções.

#### Scenario: Valor inicial vazio

- **WHEN** o controle é criado sem valor
- **THEN** o valor exposto ao formulário é `[]`

#### Scenario: Seleção de múltiplos itens

- **WHEN** o usuário seleciona dois itens
- **THEN** o valor do controle é um array com os `value` dos dois itens, na ordem de seleção

#### Scenario: Desseleção do último item

- **WHEN** o usuário remove o único item selecionado
- **THEN** o valor do controle é `[]` e **não** `null`

#### Scenario: Escrita externa de valor

- **WHEN** `writeValue` recebe `null` ou `undefined`
- **THEN** o componente trata como `[]`

### Requirement: Opções no formato `SelectItem`

O componente DEVE aceitar um input `options` do tipo `SelectItem<T>[]`,
reutilizando a interface já exportada por
`src/app/shared/ui/form-select/form-select.ts`.

#### Scenario: Item desabilitado

- **WHEN** uma opção tem `disabled: true`
- **THEN** ela é exibida na lista mas não pode ser selecionada

#### Scenario: Valor fora das opções

- **WHEN** um valor é escrito no controle e não corresponde a nenhum `value` em `options`
- **THEN** esse valor é descartado e não aparece como selecionado

#### Scenario: Opções trocadas após seleção

- **WHEN** `options` é substituída por uma lista que não contém um item já selecionado
- **THEN** esse item deixa de constar no valor do controle

### Requirement: Placeholders

O componente DEVE suportar os inputs `placeholder` e `placeholderIfEmpty`,
com o mesmo comportamento do `FormSelect`.

#### Scenario: Placeholder padrão

- **WHEN** nenhum `placeholder` é informado e existem opções
- **THEN** o texto exibido é `Selecione um ou mais itens`

#### Scenario: Lista de opções vazia

- **WHEN** `options` está vazia
- **THEN** o texto exibido é o de `placeholderIfEmpty` ou, na ausência dele, `Nenhum item disponível`

### Requirement: Limpeza da seleção

O componente DEVE suportar o input booleano `cleanable`, transformado por
`transformBoolean`, exibindo uma ação de limpar quando há seleção.

#### Scenario: Limpar seleção

- **WHEN** `cleanable` é verdadeiro, o controle está ativo e há itens selecionados
- **THEN** uma ação de limpar é exibida e, ao ser acionada, o valor vai para `[]` e o controle volta a `pristine` e `untouched`

#### Scenario: Controle inativo

- **WHEN** o controle está `disabled` ou `readonly`
- **THEN** a ação de limpar não é exibida

### Requirement: Estados herdados do controle base

O componente DEVE respeitar `disabled`, `readonly`, `loading`, `size`, `id`,
`class`, `label`, `enabled-error` e `enabled-helper` de `FormElementBase`.

#### Scenario: Estado bloqueado

- **WHEN** `disabled`, `readonly` ou `loading` é verdadeiro
- **THEN** o campo não permite abrir a lista nem alterar a seleção

#### Scenario: Tamanho do campo

- **WHEN** `size` é `sm`, `md` ou `lg`
- **THEN** a altura e a tipografia do campo acompanham o equivalente `.form-select-{size}` do Bootstrap

### Requirement: Rótulo, erros e helper

O componente DEVE renderizar o `label[app-label]` acima do campo e propagar as
saídas `error` e `helper`, como os demais controles de `shared/ui`.

#### Scenario: Exibição de erro

- **WHEN** o controle está inválido, `touched`, `dirty` e `enabled-error` é verdadeiro
- **THEN** o rótulo exibe a indicação de erro e o campo recebe o estilo de inválido

#### Scenario: Marcação de toque

- **WHEN** o campo perde o foco
- **THEN** `onTouched` é chamado e o controle passa a `touched`

### Requirement: Opções específicas de seleção múltipla

O componente DEVE expor inputs para controlar o comportamento da lista:
`searchable`, `closeOnSelect`, `maxSelectedItems` e `hideSelected`.

#### Scenario: Busca habilitada por padrão

- **WHEN** `searchable` não é informado
- **THEN** o usuário pode filtrar as opções digitando

#### Scenario: Limite de seleção

- **WHEN** `maxSelectedItems` é `2` e dois itens já estão selecionados
- **THEN** não é possível selecionar um terceiro item

#### Scenario: Ocultar selecionados

- **WHEN** `hideSelected` é verdadeiro
- **THEN** itens já selecionados não aparecem na lista suspensa

### Requirement: Aparência alinhada ao Bootstrap

O tema do ng-select DEVE ser registrado globalmente e ajustado para que o
campo seja visualmente consistente com `.form-select` e `.form-control`.

#### Scenario: Tema registrado no build

- **WHEN** a aplicação é compilada em qualquer configuração (`development` ou `production`)
- **THEN** os estilos do ng-select estão presentes no bundle global

#### Scenario: Foco

- **WHEN** o campo recebe foco
- **THEN** a borda e o anel de foco usam as variáveis de cor primária do Bootstrap, como nos demais campos do projeto
