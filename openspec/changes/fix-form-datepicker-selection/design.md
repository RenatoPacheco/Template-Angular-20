# Design

## Context

O `form-datepicker` renderiza um `input[ngbDatepicker]` por campo (um no modo única, dois no intervalo). O valor do campo e o texto exibido vêm de `DatepickerField` (`form-datepicker-field.ts`) e são aplicados ao DOM por `[value]`. O popup do ng-bootstrap (`NgbInputDatepicker`) mantém a seleção em estado próprio (`_model`) e o texto que acredita estar no campo (`_inputValue`). Esse estado só muda em `writeValue`, em `manualDateChange` (chamado pelos eventos `input` e `change` da própria diretiva) e na seleção dentro do popup.

Como o campo não está ligado a `ngModel` nem `formControl`, o `_model` não recebe as escritas programáticas. Por isso a limpeza, o `reset` e o `setValue` deixam o calendário desatualizado. Ver `proposal.md` para o problema e `specs/form-datepicker/spec.md` para as regras.

`DatepickerField` hoje guarda o struct apenas quando a data é válida e está dentro de `min`/`max`. Isso tem efeito colateral: o struct também alimenta os limites cruzados do intervalo (`startMaxLimit`, `endMinLimit`) e o `[startDate]` do popup, que hoje é a última data válida.

## Goals / Non-Goals

**Goals:**
- A seleção do popup sempre reflete o texto atual do campo, qualquer que seja a origem da mudança.
- Abrir o popup pelo botão ou pelo teclado produz o mesmo resultado.
- O mês de abertura segue a regra da spec: último mês visto no popup daquele campo.

**Non-Goals:**
- Não mudar o valor exposto ao formulário, nem os validadores, nem a máscara.
- Não mudar a semântica de `min-date` e `max-date`: elas continuam restringindo os dias habilitados, sem afetar a seleção.
- Não reescrever o `DatepickerField` como um todo; a mudança é localizada.

## Decisions

**1. Sincronizar com `manualDateChange`, não com `writeValue`.** Chamamos `picker.manualDateChange(texto)` com o texto do campo quando ele muda por escrita programática. Esse método atualiza `_model` e `_inputValue` sem tocar o DOM, então não apaga digitação parcial. Se o texto for uma data que o parser aceita, passamos o próprio texto (mesmo fora dos limites). Se for vazio, incompleto ou inválido, passamos `''`, e o `_model` fica `null`. Alternativa descartada: `writeValue(null)`, que reescreve o texto do campo e apagaria uma digitação incompleta. Alternativa descartada: sincronizar só ao abrir pelo botão, porque o teclado (Alt+SetaParaBaixo) abre o popup sem passar pelo nosso código.

**2. Pontos de sincronização.** A sincronização acontece onde o texto muda por escrita programática: `writeValue`, `resetInternal` (chamado por limpar e por mudança de modo) e as limpezas de ponta do intervalo. A digitação já é tratada pelo próprio ng-bootstrap, que chama `manualDateChange` a cada tecla, e a seleção no popup já atualiza o estado da diretiva. Assim não há um segundo caminho para manter.

**3. Struct do campo passa a ser o texto atual.** `DatepickerField` guarda o struct de qualquer data válida, sem checar `min`/`max`, e fica `null` para texto incompleto, inválido ou vazio. Isso implementa a regra de limites cruzados ("não é problema") sem código extra: se `start` estiver vazia, `end` não recebe limite. O comentário da classe, que hoje diz o contrário, será atualizado.

**4. Mês de abertura por memória de navegação.** Cada popup escuta o evento `navigate` do ng-bootstrap, que informa o mês exibido, e guarda esse mês no próprio campo (estado separado para início e fim). O `[startDate]` do popup passa a receber esse mês quando não há data selecionada, e continua recebendo o struct do campo quando há. Como o popup, ao abrir com um modelo válido, já se posiciona na data selecionada, o `startDate` só entra quando não há seleção. A primeira abertura, sem histórico, usa o mês atual, que é o padrão do ng-bootstrap.

**5. Mudança no botão de abrir.** O `togglePicker` continua igual; a sincronização não depende dele, então não precisa receber o campo como parâmetro.

## Risks / Trade-offs

- **[`manualDateChange` é público, mas não é documentado como API de sincronização]** → Fixar o comportamento com testes e registrar a dependência. Se uma atualização do ng-bootstrap mudar isso, os testes de sincronização falham.
- **[Chamar `manualDateChange` dispara `_onChange` do ng-bootstrap]** → Sem `ngModel` ou `formControl`, esse callback é o padrão no-op. O teste deve confirmar que o valor do formulário não muda por essa chamada.
- **[Abrir com modelo válido pode não reposicionar o popup]** → Teste de abertura com data selecionada, verificando o mês exibido. Se o ng-bootstrap não reposicionar, passamos o struct também como `startDate` nesse caso.
- **[`navigate` pode não cobrir todas as navegações]** → Teste com as setas e com a troca de mês e ano pelos selects do popup.
- **[Limite cruzado mudou de comportamento]** → Quando `start` fica inválida, `end` deixa de ser limitada. Isso é o comportamento aprovado; registrar no release.

## Migration Plan

Mudança localizada em um componente, sem dados persistidos e sem API nova. Rollback: reverter o commit do change.

## Open Questions

Nenhuma. As regras de comportamento estão na spec e a abordagem técnica está decidida.
