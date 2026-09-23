# Tasks — `migrate-form-select-to-ng-select`

## 1. Componente `FormSelect`

- [x] 1.1 Em `form-select.ts`, **manter intactos** a declaração e o `export` de
      `interface SelectItem<T>` (L9-13). O `FormSelectMultiple` importa essa
      interface por caminho relativo (`form-select-multiple.ts:11`) e não pode
      quebrar.
- [x] 1.2 Trocar os `imports` do `@Component` para incluir `NgSelectModule`,
      mantendo `Label`, `FormsModule` e `Button`.
- [x] 1.3 Adicionar `@ViewChild('ngSelect') ngSelect?: NgSelectComponent` e
      sobrescrever `clear()` para focar por ele — o `#element` da base espera
      um elemento nativo de formulário.
- [x] 1.4 Remover o `computed` `itens()` (L86-102), que injetava o item
      sentinela `{ value: null, disabled: true }`.
- [x] 1.5 Remover `selectedIndex()` (L120-124) e o `emitChange()` sobrescrito
      (L148-155), que resolviam a seleção por índice do `<option>`.
- [x] 1.6 Reescrever o setter de `value`: remover a validação contra `options`
      (L39-44) e mover a filtragem para um `computed` de projeção
      (`selectedValue`), como em `form-select-multiple.ts:182-186`. Isso evita
      descartar o valor quando as opções chegam de forma assíncrona.
- [x] 1.7 Ajustar `selectedItem()` / `selectedText()` para operar sobre
      `options` diretamente, sem a sentinela.
- [x] 1.8 Trocar o `computed` `placeholder` para escolher entre `placeholder`
      (padrão `Selecione um item`) e `placeholderIfEmpty` (padrão
      `Nenhum item disponível`) conforme `hasItems()`.
- [x] 1.9 Adicionar os inputs `searchable` (padrão `true`) e `close-on-select`
      (padrão `true`), ambos com `transformBoolean`.
- [x] 1.10 Adicionar o `computed` `showClear()` = `cleanable && isActive() && hasValue()`.
- [x] 1.11 Ajustar `elementClass()` para emitir `ng-select-{size}` e remover a
      lógica de `text-muted` baseada em `selectedIndex === 0` (L141-143) — o
      placeholder do ng-select já tem estilo próprio.

## 2. Template

- [x] 2.1 Manter o bloco `label[app-label]` (L1-9) e o wrapper
      `div.form-element` sem alteração de contrato.
- [x] 2.2 Trocar `[class.action-clear]="hasValue()"` (L11) por `showClear()`.
- [x] 2.3 Substituir o `<select>` e o `@for` de `<option>` (L12-26) por
      `<ng-select #ngSelect>` com `[labelForId]="id"`, `[items]="options"`,
      `bindValue="value"`, `bindLabel="text"`, `[multiple]="false"`,
      `[clearable]="false"`, `[placeholder]`, `[searchable]`,
      `[closeOnSelect]`, `[disabled]="disabled || readonly || loading"`,
      `[ngModel]`, `[ngModelOptions]="{ standalone: true }"`, `(ngModelChange)`
      e `(blur)="emitBlur()"`.
- [x] 2.4 Adicionar o `ng-option-tmp` com `<span class="option-text" [title]="item.text">`
      para truncamento com reticências e tooltip.
- [x] 2.5 Trocar a condição do botão de limpar (L27) para `@if (showClear())`.

## 3. Estilo

- [x] 3.1 Reescrever `form-select.scss` com as variáveis `$arrow-width` e
      `$clear-width`, espelhando `form-select-multiple.scss`.
- [x] 3.2 Aplicar o `padding-right` no `.ng-select-container` via `::ng-deep`
      sob `.action-clear` — o container pertence ao template do ng-select e
      fica fora do encapsulamento do componente.
- [x] 3.3 Adicionar a regra `.option-text` (block + ellipsis + nowrap).
- [x] 3.4 **Não** copiar `$search-width` nem as regras de `.ng-value-container`,
      `.ng-value`, `.ng-input`, `.ng-value-icon` e `.value-summary`: todas
      existem por causa dos chips e do `flex-wrap` do modo múltiplo.

## 4. Showcase

- [x] 4.1 Em `showcase-form-page.html:86-90`, corrigir `clearable="true"` para
      `cleanable="true"` — o input do componente sempre se chamou `cleanable`
      (`form-select.ts:50`), então o botão de limpar nunca apareceu nesta demo.
      > Também adicionado um `placeholder` explícito, para exercitar o
      > placeholder nativo que substitui a opção sentinela.
- [x] 4.2 Confirmar que o array `itens` (`showcase-form-page.ts:31-39`), que
      contém um item com `value: ''` e `disabled: true` ("Opções avançadas"),
      continua renderizando como separador desabilitado — e não como
      placeholder.

## 5. Verificação

- [x] 5.1 Rodar `ng build` e confirmar ausência de erros de template estrito.
      Conferir especificamente que `form-select-multiple.ts` continua
      compilando, ou seja, que o `export` de `SelectItem` foi preservado.
      > Build OK. `SelectItem` permanece exportada e o import relativo do
      > multiple (`form-select-multiple.ts:11`) segue resolvendo.
      > Bundle inicial caiu de 686.48 kB para 681.48 kB — a remoção da lógica
      > de índice/sentinela compensou. O warning de orçamento continua sendo o
      > pré-existente (baseline 669.01 kB, antes de qualquer uma das changes).
- [ ] 5.2 Validar em `ng serve` na página `/showcase/form`: seleção, troca de
      seleção, busca por digitação, filtro sem resultado, limpar, item
      desabilitado, `disabled`/`readonly`, valor `null` quando vazio e erro
      após `blur`.
      > **Pendente de validação humana.**
- [ ] 5.3 Comparar visualmente `app-form-select` e `app-form-select-multiple`
      lado a lado: altura, tipografia, borda, foco e posição da seta devem
      coincidir.
      > **Pendente de validação humana.**
- [ ] 5.4 Confirmar que o placeholder não aparece como item na lista aberta.
      > **Pendente de validação humana.**
- [ ] 5.5 Confirmar que não é necessário `markForCheck()` sob
      `provideZonelessChangeDetection()` ao digitar na busca. Se for, aplicar e
      registrar o motivo no `design.md`.
      > **Pendente de validação humana.** No `form-select-multiple` não foi
      > necessário, então o mesmo é esperado aqui.
