# Proposal

## Why

`FormElementBase` é a base de todos os controles de formulário de `shared/ui` (text, textarea, select, select-multiple, datepicker, editor, checkbox, radio), mas hoje mistura responsabilidades. O setter de `value` escreve no modelo e ecoa para o control em `writeValue`, o que marca campos como `dirty` em escrita programática. O `value` do modelo e o `value` da opção do checkbox usam o mesmo nome. O estado de `disabled` existe tanto como input quanto no control. O checkbox marca quando o modelo é `null` e não há `[value]`, porque `null === null`. Os componentes são sempre usados com `formControl`, então o caminho standalone só acrescenta ambiguidade. O `crypto.randomUUID()` quebra em contextos não seguros (HTTP fora de `localhost`).

## What Changes

- **BREAKING**: `FormElementBase` deixa de expor `@Input() value` e `@Input() disabled`. O modelo entra só por `writeValue` e o estado desabilitado vem só do `FormControl` (`control.disable()` / `setDisabledState`).
- **BREAKING**: `NgControl` passa a ser obrigatório (`inject(NgControl, { self: true })`). Usar um componente sem `formControl`/`formControlName` falha ao criar o componente.
- `writeValue` apenas atualiza o estado interno, sem chamar `onChange`. Escrita programática (`setValue`, `patchValue`, `reset`) não marca o control como `dirty`.
- A escrita do usuário passa por um único método de commit na base, que atualiza o estado e chama `onChange` uma vez.
- `clear()` redefine o control para `null`, marca como `pristine` e `untouched`, e devolve o foco por um hook de subclasse. O ramo sem control é removido.
- Os pontos específicos de elemento saem da base: `ViewChild('element')`, leitura do evento (`emitChange`) e critério de "vazio" (`hasValue`) viram hooks que cada subclasse implementa.
- `id` padrão passa a ser gerado com `guid-typescript` (`Guid.create()`) em vez de `crypto.randomUUID()`. Adiciona a dependência `guid-typescript`.
- O estado `status`, `pristine` e `touched` é sincronizado com o control desde a primeira renderização, sem depender da ordem de execução do Angular entre o componente e a diretiva de formulário.
- `FormCheckBase` passa a usar `optionValue` (com `@Input('value')`, então `[value]` nos templates continua funcionando). `checked` deixa de ser estado próprio e passa a ser derivado do modelo: marcado quando o modelo não é `null` e é igual a `optionValue`. O `[checked]` input deixa de existir.
- O checkbox continua valor-único neste change. Modelo em array (grupo de checkboxes) fica fora de escopo.

## Capabilities

### New Capabilities

- `form-element-contract`: contrato comum dos controles de formulário de `shared/ui` ligados a um `FormControl` (identificação, estado derivado do control, escrita sem eco, limpeza e saídas `error`/`helper`).
- `form-check-options`: comportamento de checkbox e radio com valor de opção (`optionValue`), estado marcado derivado do modelo e emissão de `null` ao desmarcar.

### Modified Capabilities

- `form-datepicker`: o requisito "Estados herdados do controle base" deixa de depender do input `disabled`. O estado desabilitado passa a vir do `FormControl`, mantendo o mesmo efeito (campo bloqueado, sem ação de calendário e sem ação de limpar).

## Impact

- Código: `src/app/shared/directives/form-element-base.directive.ts`, `form-check-base.directive.ts`, e os controles que estendem a base (`form-text`, `form-textarea`, `form-select`, `form-select-multiple`, `form-datepicker`, `form-editor`, `form-checkbox`, `form-radio`). Cada um precisa de ajuste para os hooks novos e para a remoção de `value`/`disabled` como input.
- Consumidores: templates que usam `[value]` ou `[disabled]` em componentes de formulário sem `formControl` deixam de funcionar. A demo em `showcase-form-page` usa `[value]` no checkbox e precisa continuar compilando com `optionValue`.
- Dependências: adiciona `guid-typescript` ao `package.json`.
- Specs: `form-error-toast` não muda de requisito; o comportamento de erro é preservado pela base.
