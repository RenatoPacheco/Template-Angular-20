# Tasks

## 1. Preparação

- [x] 1.1 Rodar `ng test` sem alterações e registrar o resultado de base, para comparar depois (verificação: a suíte roda até o fim e o resultado fica anotado)
- [x] 1.2 Adicionar `guid-typescript` ao `package.json` com `npm install guid-typescript` (verificação: dependência listada em `dependencies` e `ng build` ainda compila o projeto atual)
- [x] 1.3 Inspecionar o `writeValue` e o uso de `onChange` de `form-datepicker`, `form-select`, `form-select-multiple`, `form-editor`, `form-textarea` e `form-text`, e anotar em `design.md` quais dependem do eco para normalizar o modelo (verificação: anotação feita em `design.md`, seção Risks)

## 2. Base genérica (FormElementBase)

- [x] 2.1 Remover `@Input() value` e `@Input() disabled` de `form-element-base.directive.ts`; `writeValue` passa a gravar apenas `_value` (verificação: teste da spec "Escrita programática sem efeitos colaterais" passa, e `setValue` deixa o control `pristine`)
- [x] 2.2 Tornar `NgControl` obrigatório com `inject(NgControl, { self: true })` (verificação: teste da spec "Controle sem FormControl" confirma que a criação falha)
- [x] 2.3 Adicionar o método `commitValue` e os hooks `focusTarget()` e `isEmpty()`; `clear()` sem o ramo standalone (verificação: teste da spec "Limpeza do valor" passa)
- [x] 2.4 Mover a subscrição em `control.events` e o `statusUpdate` inicial para `ngAfterContentInit`, mantendo `_disabled` apenas como espelho do control (verificação: testes das specs "Estado inválido na primeira renderização" e "Desabilitar pelo control" passam)
- [x] 2.5 Trocar `crypto.randomUUID()` por `Guid.create().toString()` no `_id` (verificação: teste da spec "Renderização fora de contexto seguro" passa e o `id` informado continua sendo usado)

## 3. Controles de texto e seleção

- [x] 3.1 Adaptar `FormText` aos novos hooks: `@ViewChild` próprio, `emitChange` chamando `commitValue`, `focusTarget()` (verificação: teste da spec "Digitação atualiza o modelo" passa)
- [x] 3.2 Adaptar `FormTextarea`, `FormSelect`, `FormSelectMultiple` e `FormEditor` aos hooks, sem uso de `[value]` ou `[disabled]` como input (verificação: `ng build` compila e os templates não referenciam mais inputs removidos)
- [x] 3.3 Adaptar `FormDatepicker`: normalização do modelo que dependia do eco passa para o commit (verificação: cenários de `writeValue` com `null`, `undefined` e `''` da spec `form-datepicker` passam, e o estado desabilitado vem do control)

## 4. Checkbox e radio

- [x] 4.1 `FormCheckBase<T = string>` com `@Input('value') optionValue`, `checked` como `computed` do modelo, sem `_checked` nem `[checked]` input, e commit de `null` ao desmarcar (verificação: testes das specs "Estado marcado derivado do modelo" e "Desmarcar emite null" passam)
- [x] 4.2 Adaptar `FormCheckBox` e `FormRadio` aos novos nomes e removendo o `[checked]` input (verificação: teste da spec "Troca de opção no grupo" passa)
- [x] 4.3 Ajustar `showcase-form-page.html` se necessário, mantendo `[value]` nos checkboxes e radios (verificação: a demo compila e os checkboxes do FormArray continuam funcionando)

## 5. Integração

- [x] 5.1 Rodar `ng build` e `ng test` e confirmar que não há erro novo nem estouro de budget (verificação: ambos terminam sem erro comparado à base da tarefa 1.1)
- [x] 5.2 Conferir a demo em `localhost` e em HTTP sobre IP de rede, com checkbox, radio, texto e datepicker (verificação: nenhum erro de console e o id é gerado nos dois casos)

## Workflow follow-up

- Arquivar o change após a revisão e sincronizar os specs `form-element-contract`, `form-check-options` e `form-datepicker` com `openspec/specs/`.
