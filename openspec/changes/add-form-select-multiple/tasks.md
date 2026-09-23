# Tasks — `add-form-select-multiple`

## 1. Estilos globais do ng-select

- [x] 1.1 Criar `src/styles/plugins/_ng-select.scss` importando
      `@ng-select/ng-select/scss/default.theme.scss` e sobrescrevendo as
      variáveis do tema com as variáveis Bootstrap do projeto
      (`--bs-primary`, `--bs-primary-rgb`, `--bs-border-color`,
      `--bs-body-color`, raio de borda).
      > Desvio: o caminho passou a seguir a convenção existente de
      > `src/styles/plugins/` (como `_ck-editor.scss`) em vez de
      > `src/styles/_ng-select.scss`.
- [x] 1.2 Adicionar regras para os três tamanhos (`sm`/`md`/`lg`) casando altura,
      `padding` e `font-size` com `.form-select-{size}` do Bootstrap.
- [x] 1.3 Adicionar regras de estado inválido para `.ng-select.is-invalid`
      (borda e anel de foco em `--bs-danger`), já que o ng-select não herda
      `.is-invalid` do Bootstrap.
      > Desvio: implementado via `.form-group.ng-invalid.ng-touched.ng-dirty`,
      > que é o seletor já usado por `_forms.scss` e `_ck-editor.scss`.
- [x] 1.4 Importar o parcial em `src/styles/_plugins.scss`, ao lado de
      `./plugins/ck-editor` (e não diretamente em `src/styles.scss`).

## 2. Componente `FormSelectMultiple`

- [x] 2.1 Criar `form-select-multiple.ts` com `@Component` standalone,
      `selector: 'app-form-select-multiple'`, `templateUrl`, `styleUrl`,
      `imports: [ Label, FormsModule, Button, NgSelectModule ]` e
      `host: { '[class]': 'hostClass()' }`, seguindo `form-select.ts:15-24`.
- [x] 2.2 Declarar `export class FormSelectMultiple<T> extends FormElementBase<T[]>`
      e reexportar/importar `SelectItem<T>` de `../form-select/form-select`.
- [x] 2.3 Implementar o input `options` (`_options` signal + getter/setter),
      normalizando `null` para `[]`.
- [x] 2.4 Sobrescrever `value` para normalizar `null`/`undefined` em `[]`.
      A filtragem contra `options` fica em um `computed` de projeção, **não**
      no setter, para não apagar a seleção quando as opções chegam depois
      (ver `design.md` > "Valor sempre `T[]`").
- [x] 2.5 Implementar os inputs `placeholder` e `placeholderIfEmpty` e o
      `computed` `placeholderText` — `Selecione um ou mais itens` por padrão,
      `Nenhum item disponível` quando `options` está vazia.
- [x] 2.6 Implementar `cleanable` com `transformBoolean`, e sobrescrever/chamar
      `clear([])` para que o valor limpo seja array vazio.
- [x] 2.7 Implementar os inputs `searchable` (padrão `true`), `closeOnSelect`
      (padrão `false`), `hideSelected` (padrão `false`) com `transformBoolean`,
      e `maxSelectedItems` com `transformNumber`
      (`src/app/shared/utils/transforms.utils.ts:9`).
- [x] 2.8 Implementar os `computed` `hostClass` (`form-group mb-3 {class}`) e
      `elementClass` (tamanho + estado inválido), espelhando
      `form-select.ts:126-146`.
- [x] 2.9 Implementar o handler de mudança de seleção atualizando o valor e
      disparando `onChange`, e ligar `(blur)` a `emitBlur()`.

## 3. Template e estilo do componente

- [x] 3.1 Criar `form-select-multiple.html` com `label[app-label]` no topo
      (mesmos bindings de `form-select.html:1-9`), envolto por
      `div.form-element`.
- [x] 3.2 Renderizar `<ng-select #element>` com `[items]`, `bindValue="value"`,
      `bindLabel="text"`, `[multiple]="true"`, `[placeholder]`, `[searchable]`,
      `[closeOnSelect]`, `[hideSelected]`, `[maxSelectedItems]`,
      `[disabled]="disabled || readonly || loading"` e `[clearable]="false"`
      (a limpeza é feita pelo botão próprio do projeto).
- [x] 3.3 Renderizar o botão de limpar com `app-button` sob
      `@if (cleanable && isActive() && hasValue())`, conforme
      `form-select.html:27-36`, e `<ng-content></ng-content>` ao final.
- [x] 3.4 Criar `form-select-multiple.scss` com o posicionamento do botão de
      limpar, adaptando `form-select.scss:1-40` ao container do ng-select.

## 4. Exportação

- [x] 4.1 Adicionar `export * from './form-select-multiple/form-select-multiple';`
      em `src/app/shared/ui/index.ts`.

## 5. Demonstração

- [x] 5.1 Em `showcase-form-page.ts`, importar `FormSelectMultiple` de
      `@app/shared/ui` e incluí-lo no array `imports` (L12-16).
- [x] 5.2 Adicionar o controle `listaMultipla: this.formBuilder.control<string[]>([], { validators: [Validators.required] })`
      ao `form` (L41-109), reaproveitando o array `itens` já existente (L31-39).
- [x] 5.3 Em `showcase-form-page.html`, adicionar um bloco
      `<app-form-select-multiple>` ao lado do `app-form-select` existente (L86-90),
      exercitando `label`, `cleanable`, `placeholder` e `enabled-error`.

## 6. Verificação

- [x] 6.1 Rodar `ng build` e confirmar que não há erro de template estrito
      nem estouro do orçamento de 500kB do bundle inicial.
      > Build OK, sem erros. O orçamento **já estava estourado antes desta
      > mudança**: baseline 669.01 kB, depois 686.43 kB (+17.4 kB do tema do
      > ng-select). O warning é pré-existente e não foi introduzido aqui.
- [x] 6.2 Rodar `ng serve` e validar manualmente na página
      `/showcase/form`: seleção múltipla, busca, limpar, estado desabilitado,
      valor `[]` quando vazio, e exibição de erro após `blur` com `required`.
      > Validado visualmente pelo autor durante os ajustes de layout
      > (alinhamento do botão de limpar, truncamento e resumo).
- [x] 6.3 Confirmar que a detecção de mudanças funciona sob
      `provideZonelessChangeDetection()` — em especial ao digitar na busca.
      Se falhar, aplicar `markForCheck()` pontual e registrar o motivo em
      `design.md`.
      > Nenhum `markForCheck()` foi necessário. O risco levantado no
      > `design.md` não se materializou.

## 7. Ajustes posteriores ao plano inicial

Comportamentos acordados durante a implementação, já refletidos no `spec.md`.

- [x] 7.1 Corrigir a reserva de espaço do botão de limpar: `[class.action-clear]`
      olhava apenas `hasValue()`, aplicando o `padding` mesmo com `cleanable`
      falso. Unificado no `computed` `showClear()`, usado pela classe e pelo `@if`.
- [x] 7.2 Alinhar o botão de limpar à seta do ng-select via as variáveis
      `$arrow-width` / `$clear-width`, em vez dos valores herdados do
      `form-select.scss` (calibrados para a seta do `<select>` nativo).
- [x] 7.3 Truncar com reticências o texto das opções e dos chips, com `title`
      nativo expondo o texto completo.
- [x] 7.4 Evitar a linha em branco causada pelo input de busca: `.ng-input` é
      irmão dos chips num container `flex-wrap: wrap`, então o chip reserva
      `$search-width` de folga e o input recebe `flex: 1 1 0`.
- [x] 7.5 Adicionar o input opcional `max-visible-items` (padrão `0` = lista
      todos). Acima do limite o campo mostra `N itens selecionados`.
      Exigiu trocar `ng-label-tmp` por `ng-multi-label-tmp`, pois só este
      recebe a lista completa de selecionados.

