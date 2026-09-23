# form-select

## MODIFIED Requirements

### Requirement: Seleção única ligada a formulários Angular

O componente `app-form-select` DEVE funcionar como um `ControlValueAccessor`,
herdando de `FormElementBase<T>`, permitindo a seleção de no máximo um item.
A seleção DEVE ser resolvida pelo **valor** do item, não pela posição dele na
lista.

#### Scenario: Valor inicial vazio

- **WHEN** o controle é criado sem valor
- **THEN** o valor exposto ao formulário é `null`

#### Scenario: Seleção de um item

- **WHEN** o usuário seleciona um item
- **THEN** o valor do controle é o `value` desse item

#### Scenario: Troca de seleção

- **WHEN** o usuário seleciona outro item
- **THEN** o valor anterior é substituído, mantendo no máximo um selecionado

#### Scenario: Reordenação das opções

- **WHEN** a lista `options` é reordenada mantendo o item selecionado
- **THEN** o valor do controle permanece inalterado

### Requirement: Placeholder

O componente DEVE exibir um texto de placeholder quando nada está selecionado,
usando o mecanismo nativo de placeholder do campo — **sem** inserir um item
artificial na lista de opções.

#### Scenario: Placeholder padrão

- **WHEN** nenhum `placeholder` é informado e existem opções
- **THEN** o texto exibido é `Selecione um item`

#### Scenario: Lista de opções vazia

- **WHEN** `options` está vazia
- **THEN** o texto exibido é o de `placeholderIfEmpty` ou, na ausência dele, `Nenhum item disponível`

#### Scenario: Placeholder não é selecionável

- **WHEN** a lista de opções é aberta
- **THEN** o texto de placeholder não aparece como um item da lista

### Requirement: Opções no formato `SelectItem`

O componente DEVE aceitar um input `options` do tipo `SelectItem<T>[]` e
continuar exportando essa interface, da qual o `FormSelectMultiple` depende.

#### Scenario: Item desabilitado

- **WHEN** uma opção tem `disabled: true`
- **THEN** ela é exibida na lista mas não pode ser selecionada

#### Scenario: Valor fora das opções

- **WHEN** um valor é escrito no controle e não corresponde a nenhum `value` em `options`
- **THEN** nenhum item é exibido como selecionado

#### Scenario: Opções carregadas depois do valor

- **WHEN** o valor é escrito antes de `options` ser preenchida e o item correspondente existe na lista que chega depois
- **THEN** o item passa a ser exibido como selecionado, sem que o valor tenha sido descartado

### Requirement: Limpeza da seleção

O componente DEVE suportar o input booleano `cleanable`, transformado por
`transformBoolean`, exibindo uma ação de limpar quando há seleção.

#### Scenario: Limpar seleção

- **WHEN** `cleanable` é verdadeiro, o controle está ativo e há um item selecionado
- **THEN** uma ação de limpar é exibida e, ao ser acionada, o valor vai para `null` e o controle volta a `pristine` e `untouched`

#### Scenario: Controle inativo

- **WHEN** o controle está `disabled` ou `readonly`
- **THEN** a ação de limpar não é exibida

#### Scenario: Limpeza desabilitada

- **WHEN** `cleanable` é falso
- **THEN** a ação de limpar não é exibida **e** nenhum espaço é reservado para ela no campo

### Requirement: Aparência alinhada ao Bootstrap

O campo DEVE ser visualmente consistente com `.form-select` do Bootstrap e com
o `app-form-select-multiple`.

#### Scenario: Dois campos na mesma tela

- **WHEN** um `app-form-select` e um `app-form-select-multiple` são exibidos juntos
- **THEN** ambos têm a mesma altura, tipografia, borda e anel de foco

#### Scenario: Tamanho do campo

- **WHEN** `size` é `sm`, `md` ou `lg`
- **THEN** a altura e a tipografia acompanham o equivalente `.form-select-{size}` do Bootstrap

#### Scenario: Estado inválido

- **WHEN** o controle está inválido, `touched` e `dirty`
- **THEN** a borda do campo usa a cor de erro do Bootstrap

## ADDED Requirements

### Requirement: Busca nas opções

O componente DEVE permitir filtrar as opções por digitação, controlado pelo
input `searchable`.

#### Scenario: Busca habilitada por padrão

- **WHEN** `searchable` não é informado
- **THEN** o usuário pode filtrar as opções digitando

#### Scenario: Busca desabilitada

- **WHEN** `searchable` é falso
- **THEN** o campo não aceita digitação e funciona apenas por seleção

#### Scenario: Filtro sem resultado

- **WHEN** o termo digitado não corresponde a nenhuma opção
- **THEN** a lista informa que nenhum item foi encontrado

### Requirement: Texto longo

Textos que não cabem no espaço disponível DEVEM ser truncados com reticências,
mantendo o conteúdo completo acessível.

#### Scenario: Opção com texto longo

- **WHEN** o texto de uma opção da lista excede a largura disponível
- **THEN** ele é truncado com reticências e o texto completo é exposto no `title`

#### Scenario: Item selecionado com texto longo

- **WHEN** o texto do item selecionado excede a largura disponível
- **THEN** ele é truncado com reticências, sem invadir a seta de seleção nem a ação de limpar

### Requirement: Fechamento da lista ao selecionar

O componente DEVE expor o input `close-on-select`, com padrão verdadeiro, já
que a seleção é única.

#### Scenario: Comportamento padrão

- **WHEN** o usuário seleciona um item
- **THEN** a lista suspensa é fechada

## REMOVED Requirements

### Requirement: Item sentinela de placeholder

**Razão**: o ng-select oferece placeholder nativo; injetar um item falso na
lista era um contorno do `<select>` nativo.

**Migração**: consumidores que dependiam de um item com `value: null` na lista
devem usar `placeholder` / `placeholderIfEmpty`. Nenhum consumidor atual
depende disso.

### Requirement: Resolução da seleção por índice

**Razão**: o `<select>` nativo obrigava a usar o índice do `<option>` como
valor do elemento (`form-select.html:21`, `form-select.ts:148-155`). Com o
ng-select a ligação é feita diretamente por valor, o que também elimina a
fragilidade de o valor mudar quando a lista é reordenada.

**Migração**: nenhuma ação para consumidores — o valor exposto ao formulário
já era o `value` do item, não o índice.
