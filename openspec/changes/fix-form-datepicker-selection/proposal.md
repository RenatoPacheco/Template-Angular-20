# Proposal

## Why

O calendário do `form-datepicker` não reflete o valor do campo. Quando o campo é limpo por `reset`, `setValue`, pela ação de limpar ou por digitação, o popup continua destacando a última data selecionada. A causa é que o `ngbDatepicker` interno do ng-bootstrap guarda a seleção em estado próprio, que só é atualizado por escrita via `writeValue`, digitação e seleção no popup. O campo só atualiza o DOM via `[value]`, e isso não sincroniza esse estado. O bug também viola o cenário "Escrita externa vazia" da spec `form-datepicker`, que já exige que nenhuma data fique destacada.

A regra de destaque do campo também precisa mudar. Hoje texto inválido mantém a última data válida destacada. O comportamento desejado é que o calendário reflita o texto atual do campo no momento em que é aberto.

## What Changes

- Ao abrir o calendário (botão de abrir do campo única ou de cada ponta do intervalo), a seleção é sincronizada com o texto atual do campo:
  - Data completa e válida: fica selecionada e o calendário abre no mês dela. Fora de `min-date`/`max-date`, a biblioteca do calendário não exibe a seleção.
  - Texto vazio, incompleto ou inválido: nenhuma data fica selecionada.
- Texto inválido ou vazio não mantém mais a última data válida como seleção.
- Alt+SetaParaBaixo com o campo focado abre o calendário, com a seleção sincronizada.
- Limites cruzados do intervalo deixam de preservar a última ponta válida: a restrição de `end` segue o estado atual de `start`.
- Quando não há data selecionada, o calendário abre no último mês que o usuário viu no popup, mesmo que o texto tenha sido editado depois. Cada popup (única, início e fim) guarda o próprio mês.
- A spec `form-datepicker` é alterada: o requisito de data única passa a dizer que texto inválido ou vazio não destaca data, e um novo requisito descreve a sincronização do calendário ao abrir e o mês de abertura.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `form-datepicker`: requisito "Data única ligada a formulários Angular" (cenário de digitação inválida passa a não destacar data) e novo requisito de sincronização do calendário com o campo ao abrir, incluindo o mês de abertura.

## Assumptions

- "Último mês desde que foi aberto" é interpretado como o último mês exibido pelo popup daquele campo. No intervalo, início e fim têm memória separada.
- Na primeira abertura, sem mês visto e sem data válida, o calendário abre no mês atual, que é o comportamento padrão do ng-bootstrap.
- A regra de limites cruzados não exige preservar a última data válida. Se o início ficar vazio ou inválido, o fim não herda mais essa restrição.

## Impact

- Código: `src/app/shared/ui/form-datepicker/form-datepicker.ts`, `form-datepicker-field.ts` (o comentário e a regra do struct que só avança em datas válidas) e `form-datepicker.html` (bindings de `startDate` e de navegação do popup).
- Testes: `form-datepicker.spec.ts` ganha cenários de sincronização e de mês de abertura.
- Specs: delta em `specs/form-datepicker/spec.md`.
- Dependências: nenhuma nova.
- Compatibilidade: o valor exposto ao formulário não muda. A mudança afeta só o que o calendário destaca e em qual mês abre.
