# Tasks — `add-form-select-multiple`

## 1. Estilos globais do ng-select

- [ ] 1.1 Criar `src/styles/_ng-select.scss` importando
      `@ng-select/ng-select/scss/default.theme.scss` e sobrescrevendo as
      variáveis do tema com as variáveis Bootstrap do projeto
      (`--bs-primary`, `--bs-primary-rgb`, `--bs-border-color`,
      `--bs-body-color`, raio de borda).
- [ ] 1.2 Adicionar regras para os três tamanhos (`sm`/`md`/`lg`) casando altura,
      `padding` e `font-size` com `.form-select-{size}` do Bootstrap.
- [ ] 1.3 Adicionar regras de estado inválido para `.ng-select.is-invalid`
      (borda e anel de foco em `--bs-danger`), já que o ng-select não herda
      `.is-invalid` do Bootstrap.
- [ ] 1.4 Importar o parcial em `src/styles.scss`, após `./styles/bootstrap`.

## 2. Componente `FormSelectMultiple`

- [ ] 2.1 Criar `form-select-multiple.ts` com `@Component` standalone,
      `selector: 'app-form-select-multiple'`, `templateUrl`, `styleUrl`,
      `imports: [ Label, FormsModule, Button, NgSelectModule ]` e
      `host: { '[class]': 'hostClass()' }`, seguindo `form-select.ts:15-24`.
- [ ] 2.2 Declarar `export class FormSelectMultiple<T> extends FormElementBase<T[]>`
      e reexportar/importar `SelectItem<T>` de `../form-select/form-select`.
- [ ] 2.3 Implementar o input `options` (`_options` signal + getter/setter),
      normalizando `null` para `[]`.
- [ ] 2.4 Sobrescrever `value` para normalizar `null`/`undefined` em `[]`.
      A filtragem contra `options` fica em um `computed` de projeção, **não**
      no setter, para não apagar a seleção quando as opções chegam depois
      (ver `design.md` > "Valor sempre `T[]`").
- [ ] 2.5 Implementar os inputs `placeholder` e `placeholderIfEmpty` e o
      `computed` `placeholderText` — `Selecione um ou mais itens` por padrão,
      `Nenhum item disponível` quando `options` está vazia.
- [ ] 2.6 Implementar `cleanable` com `transformBoolean`, e sobrescrever/chamar
      `clear([])` para que o valor limpo seja array vazio.
- [ ] 2.7 Implementar os inputs `searchable` (padrão `true`), `closeOnSelect`
      (padrão `false`), `hideSelected` (padrão `false`) com `transformBoolean`,
      e `maxSelectedItems` com `transformNumber`
      (`src/app/shared/utils/transforms.utils.ts:9`).
- [ ] 2.8 Implementar os `computed` `hostClass` (`form-group mb-3 {class}`) e
      `elementClass` (tamanho + estado inválido), espelhando
      `form-select.ts:126-146`.
- [ ] 2.9 Implementar o handler de mudança de seleção atualizando o valor e
      disparando `onChange`, e ligar `(blur)` a `emitBlur()`.

## 3. Template e estilo do componente

- [ ] 3.1 Criar `form-select-multiple.html` com `label[app-label]` no topo
      (mesmos bindings de `form-select.html:1-9`), envolto por
      `div.form-element`.
- [ ] 3.2 Renderizar `<ng-select #element>` com `[items]`, `bindValue="value"`,
      `bindLabel="text"`, `[multiple]="true"`, `[placeholder]`, `[searchable]`,
      `[closeOnSelect]`, `[hideSelected]`, `[maxSelectedItems]`,
      `[disabled]="disabled || readonly || loading"` e `[clearable]="false"`
      (a limpeza é feita pelo botão próprio do projeto).
- [ ] 3.3 Renderizar o botão de limpar com `app-button` sob
      `@if (cleanable && isActive() && hasValue())`, conforme
      `form-select.html:27-36`, e `<ng-content></ng-content>` ao final.
- [ ] 3.4 Criar `form-select-multiple.scss` com o posicionamento do botão de
      limpar, adaptando `form-select.scss:1-40` ao container do ng-select.

## 4. Exportação

- [ ] 4.1 Adicionar `export * from './form-select-multiple/form-select-multiple';`
      em `src/app/shared/ui/index.ts`.

## 5. Demonstração

- [ ] 5.1 Em `showcase-form-page.ts`, importar `FormSelectMultiple` de
      `@app/shared/ui` e incluí-lo no array `imports` (L12-16).
- [ ] 5.2 Adicionar o controle `listaMultipla: this.formBuilder.control<string[]>([], { validators: [Validators.required] })`
      ao `form` (L41-109), reaproveitando o array `itens` já existente (L31-39).
- [ ] 5.3 Em `showcase-form-page.html`, adicionar um bloco
      `<app-form-select-multiple>` ao lado do `app-form-select` existente (L86-90),
      exercitando `label`, `cleanable`, `placeholder` e `enabled-error`.

## 6. Verificação

- [ ] 6.1 Rodar `ng build` e confirmar que não há erro de template estrito
      nem estouro do orçamento de 500kB do bundle inicial.
- [ ] 6.2 Rodar `ng serve` e validar manualmente na página
      `/showcase/form`: seleção múltipla, busca, limpar, estado desabilitado,
      valor `[]` quando vazio, e exibição de erro após `blur` com `required`.
- [ ] 6.3 Confirmar que a detecção de mudanças funciona sob
      `provideZonelessChangeDetection()` — em especial ao digitar na busca.
      Se falhar, aplicar `markForCheck()` pontual e registrar o motivo em
      `design.md`.
