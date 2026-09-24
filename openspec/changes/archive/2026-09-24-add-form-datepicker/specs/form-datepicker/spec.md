# form-datepicker

## Purpose

Oferecer um controle de data com calendário visual em português (ng-bootstrap) para os formulários do projeto, cobrindo data única e intervalo, com valores em texto `dd/MM/yyyy` compatíveis com as máscaras e validadores já existentes.

## ADDED Requirements

### Requirement: Data única ligada a formulários Angular

O componente DEVE funcionar como um `ControlValueAccessor`, expondo o valor como `string | null` no modo de data única: data válida em `dd/MM/yyyy`, ou o próprio texto digitado quando inválido/incompleto (para que os validadores do formulário acusem o erro); campo vazio é `null`.

#### Scenario: Valor inicial vazio

- **WHEN** o controle é criado sem valor
- **THEN** o valor exposto ao formulário é `null` e o campo é exibido vazio

#### Scenario: Seleção pelo calendário

- **WHEN** o usuário escolhe um dia no calendário popup
- **THEN** o campo exibe a data em `dd/MM/yyyy`, o valor do controle é essa mesma `string` e o popup fecha

#### Scenario: Digitação manual válida

- **WHEN** o usuário digita `15/03/2026` (com a máscara aplicada durante a digitação)
- **THEN** o valor do controle é `15/03/2026` e o calendário passa a destacar esse dia quando reaberto

#### Scenario: Digitação inválida ou incompleta

- **WHEN** o usuário deixa no campo um texto que não é uma data válida em `dd/MM/yyyy`
- **THEN** o valor do controle é o próprio texto digitado (por exemplo, `31/02/2026`) e a validação de data do formulário (por exemplo, `CustomValidators.date()`) acusa o erro

#### Scenario: Escrita externa de valor

- **WHEN** `writeValue` recebe uma `string` em `dd/MM/yyyy`
- **THEN** o campo e o calendário exibem essa data

#### Scenario: Escrita externa vazia

- **WHEN** `writeValue` recebe `null`, `undefined` ou `''`
- **THEN** o campo é esvaziado e nenhuma data fica destacada no calendário

### Requirement: Modo intervalo

O componente DEVE suportar o modo de intervalo (`range`), expondo o valor como `{ start: string | null; end: string | null }`: cada ponta é a data em `dd/MM/yyyy` quando válida, o próprio texto digitado quando inválido, ou `null` quando vazia.

#### Scenario: Seleção de intervalo pelo calendário

- **WHEN** o usuário escolhe uma data de início e depois uma data de fim no calendário
- **THEN** os dois campos exibem as datas em `dd/MM/yyyy` e o valor do controle é `{ start, end }` com as mesmas `strings`

#### Scenario: Intervalo parcial

- **WHEN** apenas a data de início foi escolhida
- **THEN** o valor do controle é `{ start: '<data>', end: null }`

#### Scenario: Inversão das pontas

- **WHEN** o usuário escolhe a data de fim anterior à data de início, com ambas as pontas válidas
- **THEN** as pontas são normalizadas para que `start` seja sempre a data mais antiga e `end` a mais recente

#### Scenario: Ponta inválida

- **WHEN** uma ponta contém texto inválido
- **THEN** o valor carrega o texto cru daquela ponta, sem normalização de ordem (que exige ambas válidas)

#### Scenario: Limpeza do intervalo

- **WHEN** a ação de limpar é acionada no modo intervalo
- **THEN** o valor do controle vai para `{ start: null, end: null }`, os dois campos são esvaziados e o foco retorna ao campo que estava em uso (início, por padrão)

#### Scenario: Limpar data de início

- **WHEN** há data no início e o controle está ativo
- **THEN** a ação de limpar do campo de início é exibida e, ao ser acionada, só a ponta `start` vai para `null` (a ponta `end` é preservada) e o foco retorna ao campo de início

#### Scenario: Limpar data de fim

- **WHEN** há data no fim e o controle está ativo
- **THEN** a ação de limpar do campo de fim é exibida e, ao ser acionada, só a ponta `end` vai para `null` (a ponta `start` é preservada) e o foco retorna ao campo de fim

#### Scenario: Escrita externa de intervalo

- **WHEN** `writeValue` recebe `{ start: '10/03/2026', end: '20/03/2026' }`
- **THEN** os dois campos e o destaque do calendário refletem esse período

### Requirement: Digitação com máscara e calendário popup

O componente DEVE aceitar digitação manual com a máscara `dd/MM/yyyy` **e** oferecer um botão que abre/fecha o calendário popup do ng-bootstrap.

#### Scenario: Abrir pelo botão

- **WHEN** o usuário clica no botão de calendário
- **THEN** o popup do calendário abre ancorado ao campo

#### Scenario: Fechar o popup

- **WHEN** o popup está aberto e o usuário seleciona uma data, pressiona Escape ou clica fora
- **THEN** o popup fecha e o foco retorna ao campo

#### Scenario: Navegação por teclado no campo

- **WHEN** o campo tem foco e o usuário pressiona Alt+SetaParaBaixo (ou Enter, conforme o comportamento padrão do ng-bootstrap)
- **THEN** o calendário abre

### Requirement: Limpeza do valor

O componente DEVE exibir uma ação de limpar quando houver valor e o controle estiver ativo, seguindo o padrão visual dos demais controles de `shared/ui`.

#### Scenario: Limpar data única

- **WHEN** há data preenchida e o controle está ativo
- **THEN** a ação de limpar é exibida e, ao ser acionada, o valor vai para `null`, o controle volta a `pristine` e `untouched` e o foco retorna ao campo

#### Scenario: Controle inativo

- **WHEN** o controle está `disabled` ou `readonly`
- **THEN** a ação de limpar não é exibida

### Requirement: Limites de data

O componente DEVE aceitar datas mínima e máxima opcionais, em `dd/MM/yyyy`, que restringem os dias selecionáveis no calendário. Na digitação, o texto é sempre exposto como digitado (campo vazio é `null`) e cabe aos validadores do formulário acusar valores fora do limite.

#### Scenario: Dia fora do limite

- **WHEN** `min-date` é `01/01/2026` e o usuário tenta selecionar ou digitar `31/12/2025`
- **THEN** o dia aparece desabilitado no calendário; se digitado, o valor do controle é o texto cru `31/12/2025` e a validação do formulário acusa o erro

#### Scenario: Sem limites

- **WHEN** nenhuma data limite é informada
- **THEN** qualquer data válida em `dd/MM/yyyy` pode ser digitada ou selecionada

### Requirement: Localização pt-BR

O calendário DEVE ser exibido em português: nomes de meses e dias da semana abreviados em pt-BR, semana começando na segunda-feira e placeholder padrão `dd/mm/yyyy`.

#### Scenario: Abertura localizada

- **WHEN** o calendário é aberto sem nenhuma personalização de idioma pelo consumidor
- **THEN** os cabeçalhos de dias e meses aparecem em português e a primeira coluna é segunda-feira

### Requirement: Estados herdados do controle base

O componente DEVE respeitar `disabled`, `readonly`, `loading`, `size`, `id`, `class`, `label`, `enabled-error` e `enabled-helper`, como os demais controles de `shared/ui`.

#### Scenario: Estado bloqueado

- **WHEN** `disabled`, `readonly` ou `loading` é verdadeiro
- **THEN** o campo não permite digitar, o botão de calendário não abre o popup e a ação de limpar não aparece

#### Scenario: Tamanho do campo

- **WHEN** `size` é `sm`, `md` ou `lg`
- **THEN** a altura e a tipografia do campo acompanham o equivalente `.form-control-{size}` do Bootstrap

### Requirement: Rótulo, erros e helper

O componente DEVE renderizar o `label[app-label]` acima do campo e propagar as saídas `error` e `helper`, como os demais controles de `shared/ui`.

#### Scenario: Exibição de erro

- **WHEN** o controle está inválido, `touched`, `dirty` e `enabled-error` é verdadeiro
- **THEN** o rótulo exibe a indicação de erro e o campo recebe o estilo de inválido, mas os selects de mês/ano do calendário mantêm o estilo normal

#### Scenario: Marcação de toque

- **WHEN** o campo perde o foco (incluindo ao fechar o popup após seleção)
- **THEN** `onTouched` é chamado e o controle passa a `touched`
