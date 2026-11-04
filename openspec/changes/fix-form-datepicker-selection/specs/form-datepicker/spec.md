# Spec Delta

## MODIFIED Requirements

### Requirement: Data única ligada a formulários Angular

O componente DEVE funcionar como um `ControlValueAccessor`, expondo o valor como `string | null` no modo de data única: data válida em `dd/MM/yyyy`, ou o próprio texto digitado quando inválido/incompleto (para que os validadores do formulário acusem o erro); campo vazio é `null`. Texto inválido, incompleto ou vazio NÃO DEVE deixar nenhuma data destacada no calendário.

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
- **THEN** o valor do controle é o próprio texto digitado (por exemplo, `31/02/2026`), a validação de data do formulário (por exemplo, `CustomValidators.date()`) acusa o erro, e ao abrir o calendário nenhuma data fica destacada

#### Scenario: Escrita externa de valor

- **WHEN** `writeValue` recebe uma `string` em `dd/MM/yyyy`
- **THEN** o campo e o calendário exibem essa data

#### Scenario: Escrita externa vazia

- **WHEN** `writeValue` recebe `null`, `undefined` ou `''`
- **THEN** o campo é esvaziado e nenhuma data fica destacada no calendário

## ADDED Requirements

### Requirement: Calendário reflete o texto do campo ao abrir

Ao abrir o calendário de um campo, a data selecionada DEVE corresponder ao texto atual do campo, independentemente de como o texto foi alterado (limpeza, `reset`, `setValue`, digitação ou seleção). Uma data completa e válida fica selecionada no calendário. Quando a data está fora de `min-date` ou `max-date`, o calendário não a exibe como selecionada (comportamento da biblioteca do calendário), e o valor do campo continua sendo o texto digitado. Texto vazio, incompleto ou inválido não fica selecionado.

#### Scenario: Data válida após limpeza anterior

- **WHEN** o campo foi limpo pela ação de limpar, depois recebeu `10/03/2026` digitado e o usuário abre o calendário
- **THEN** o dia `10/03/2026` aparece selecionado

#### Scenario: Texto incompleto não seleciona

- **WHEN** o campo tinha a data `04/11/2026` selecionada, o usuário apaga parte do texto para `04/11/202` e abre o calendário
- **THEN** nenhum dia aparece selecionado

#### Scenario: Campo vazio após reset

- **WHEN** o controle recebe `reset()` enquanto o calendário tinha uma data selecionada, e depois o usuário abre o calendário
- **THEN** nenhum dia aparece selecionado

#### Scenario: Data fora do limite não aparece selecionada

- **WHEN** `min-date` é `01/01/2026` e o usuário digita `31/12/2025`, depois abre o calendário
- **THEN** o campo mantém `31/12/2025` como texto, o valor do controle é esse texto cru, e o calendário não destaca nenhum dia

#### Scenario: Limite cruzado do intervalo

- **WHEN** no modo intervalo a ponta `start` está vazia ou inválida
- **THEN** a ponta `end` não aplica limite mínimo derivado de `start`

### Requirement: Mês de abertura do calendário

Quando não há data selecionada ao abrir o calendário, o popup DEVE abrir no último mês que o usuário viu naquele popup, mesmo que o texto do campo tenha sido editado depois. Início e fim do intervalo mantêm cada um o próprio mês. Antes de qualquer visualização, o popup DEVE abrir no mês atual.

#### Scenario: Reabrir no último mês visto

- **WHEN** o usuário navegou o calendário até `março/2026`, fechou sem selecionar, apagou o texto e reabriu o calendário
- **THEN** o popup abre em `março/2026` com nenhum dia selecionado

#### Scenario: Primeira abertura sem histórico

- **WHEN** o campo está vazio e o calendário nunca foi navegado
- **THEN** o popup abre no mês atual

#### Scenario: Intervalo com meses independentes

- **WHEN** no intervalo o usuário navegou o popup de início até `janeiro/2026` e o de fim até `julho/2026`, ambos sem seleção
- **THEN** o popup de início reabre em `janeiro/2026` e o de fim em `julho/2026`
