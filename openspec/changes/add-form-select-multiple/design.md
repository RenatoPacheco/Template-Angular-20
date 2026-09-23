# Design — `FormSelectMultiple`

## Contexto

Todos os controles de formulário do projeto seguem um padrão bem definido:

- herdam de `FormElementBase<T>` (`src/app/shared/directives/form-element-base.directive.ts:16`),
  que se registra como o próprio `ControlValueAccessor` no construtor (L18-22);
- expõem inputs com o par *signal privado + getter/setter* (`_placeholder` / `placeholder`);
- usam `transformBoolean` (`src/app/shared/utils/transforms.utils.ts:19`) para inputs booleanos;
- renderizam `label[app-label]` no topo do template, com `error`/`helper`;
- calculam `hostClass` e `elementClass` via `computed`;
- são standalone e exportados pelo barrel `src/app/shared/ui/index.ts`.

O novo componente segue exatamente esse padrão. O que muda é o elemento interno:
`<ng-select>` em vez de `<select>` nativo.

## Decisões

### Herdar de `FormElementBase<T[]>`

`hasValue` da base (L232-256) já trata arrays corretamente
(`array.length > 0`), então `cleanable`, `isActive` e os estados derivados
funcionam sem adaptação. `clear()` da base (L270-282) também serve, bastando
chamá-lo com `[]` em vez do `null` padrão.

**Alternativa descartada:** criar um `ControlValueAccessor` próprio. Perderia
a integração com `ValidatorService`/`ToastService` e a sincronização de status
já implementada em `statusUpdate()` (L318-333).

### Valor sempre `T[]`, nunca `null`

Confirmado com o solicitante. Evita o tipo `T[] | null` em toda a aplicação
consumidora e faz `Validators.required` / `minLength` se comportarem de forma
previsível. O setter de `value` normaliza `null`/`undefined` para `[]` e filtra
valores que não existem em `options` — espelhando a validação que o `FormSelect`
faz em `form-select.ts:39-44`, mas aplicada a cada elemento do array.

Consequência: o setter precisa evitar recursão/loop quando `options` chega
**depois** do valor (cenário comum com opções carregadas de API). A
normalização é feita em um `computed` derivado de `_value()` + `options()`, e
o valor bruto é preservado no signal; apenas a projeção para o ng-select é
filtrada. Isso evita apagar silenciosamente uma seleção válida durante o
carregamento assíncrono das opções.

### Ligação com o ng-select

Usar `[items]="options"`, `bindValue="value"`, `bindLabel="text"`,
`[multiple]="true"`. Com `bindValue`, o `ngModel`/valor emitido já é `T[]`
e não `SelectItem<T>[]`, que é o formato desejado para o formulário.

`disabled` do ng-select recebe `disabled || readonly || loading`, igual ao
`form-select.html:15`.

`(blur)` chama `emitBlur()` da base; a mudança de seleção atualiza o signal
de valor e dispara `onChange`.

O `NgSelectModule` é importado diretamente no `imports` do componente
standalone — não há necessidade de módulo compartilhado.

### Placeholders

Diferentemente do `FormSelect`, que injeta uma opção fictícia `{ value: null }`
na lista (`form-select.ts:98-101`), o ng-select tem `placeholder` nativo.
Portanto **não** haverá item sentinela na lista; o `placeholder` é calculado
por um `computed` que escolhe entre `placeholder` e `placeholderIfEmpty`
conforme `hasItems()`.

### Tema e estilos

O pacote traz `@ng-select/ng-select/scss/default.theme.scss`. A estratégia:

1. Criar `src/styles/_ng-select.scss` que importa o tema SCSS e sobrescreve as
   variáveis do ng-select com as variáveis CSS do Bootstrap já usadas no
   projeto (`--bs-primary`, `--bs-primary-rgb`, `--bs-border-color`, etc.,
   conforme já feito em `form-select.scss:31-34`).
2. Importar esse parcial a partir de `src/styles.scss` (que hoje tem 2 linhas e
   já agrega `./styles/bootstrap`).

**Alternativa descartada:** adicionar `themes/default.theme.css` diretamente
nos arrays `styles` de `angular.json`. Funciona, mas impede o override de
variáveis SCSS e obriga a duplicar a entrada nas duas configurações de build
(`angular.json:58` e `:117`). Importar via `styles.scss` resolve as duas
configurações de uma vez.

Estados de validação (`.ng-invalid` + `ng-touched`) precisam de regra explícita,
pois o ng-select não herda `.is-invalid` do Bootstrap automaticamente.

### Riscos

- **Tamanho do bundle:** o orçamento de produção é 500kB de warning para o
  bundle inicial. O tema do ng-select é pequeno (~10kB), mas o build deve ser
  verificado ao final.
- **Zoneless:** a aplicação usa `provideZonelessChangeDetection()`. O ng-select
  não é totalmente signal-based; se houver falha de detecção de mudança em
  cenários de busca, será necessário um `ChangeDetectorRef.markForCheck()`
  pontual nos handlers. Verificar na demo antes de concluir.
- **Conflito visual:** o tema padrão do ng-select define altura e padding
  próprios que podem brigar com as classes `.form-select-{sm,lg}`. O override
  SCSS deve ser feito por variáveis, não por `!important`.

## Escopo de arquivos

**Novos**
- `src/app/shared/ui/form-select-multiple/form-select-multiple.ts`
- `src/app/shared/ui/form-select-multiple/form-select-multiple.html`
- `src/app/shared/ui/form-select-multiple/form-select-multiple.scss`
- `src/styles/_ng-select.scss`

**Alterados**
- `src/app/shared/ui/index.ts` — exportar o novo componente
- `src/styles.scss` — importar o parcial do ng-select
- `src/app/feature/showcases/pages/showcase-form-page/showcase-form-page.ts` — import e novo `FormControl`
- `src/app/feature/showcases/pages/showcase-form-page/showcase-form-page.html` — bloco de demonstração

**Não alterados** — `form-select.ts/html/scss`, `angular.json`.
