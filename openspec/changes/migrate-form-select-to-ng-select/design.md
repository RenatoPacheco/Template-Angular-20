# Design — migração do `FormSelect` para ng-select

## Contexto

O `FormSelectMultiple` (`src/app/shared/ui/form-select-multiple/`) já resolveu
os problemas de integrar o ng-select ao padrão de formulários do projeto. Esta
migração aplica as mesmas soluções ao single, e **não** deve redescobri-las.

O que já está pronto e é reaproveitado sem alteração:

- tema global em `src/styles/plugins/_ng-select.scss`, importado por
  `src/styles/_plugins.scss`;
- estado inválido tratado pelo seletor `.form-group.ng-invalid.ng-touched.ng-dirty`,
  convenção de `_forms.scss` e `_ck-editor.scss`;
- classes de tamanho `.ng-select-sm` / `.ng-select-lg`.

## Decisões

### Duplicar, não abstrair

Confirmado com o solicitante. Single e multiple vão repetir os inputs
`options`, `placeholder`, `placeholderIfEmpty`, `cleanable`, `searchable` e boa
parte do SCSS do botão de limpar.

**Alternativa descartada:** extrair um `FormSelectBase`. Reduziria a
duplicação, mas exigiria refatorar o `form-select-multiple`, que acabou de ser
validado visualmente numa sequência longa de ajustes finos. O custo de
desestabilizá-lo agora supera o ganho, e a abstração fica mais barata de
extrair depois, quando existir um terceiro caso de uso para guiá-la.

Consequência assumida: uma correção de comportamento comum (por exemplo, no
botão de limpar) precisará ser aplicada em dois lugares.

### Ligação por valor e remoção da sentinela

`[items]="options"`, `bindValue="value"`, `bindLabel="text"`,
`[multiple]="false"`. Com `bindValue`, o valor emitido é `T` direto.

Isso elimina de uma vez:

- o `computed` `itens()` (`form-select.ts:86-102`), que injetava a sentinela;
- `selectedIndex()` (`form-select.ts:120-124`);
- o `emitChange()` sobrescrito (`form-select.ts:148-155`), que fazia
  `Number(target.value)` para converter índice em item;
- a classe `text-muted` aplicada quando o índice selecionado era `0`
  (`form-select.ts:141-143`), já que o placeholder do ng-select tem estilo
  próprio (`_ng-select.scss`, regra `.ng-placeholder`).

`placeholder` passa a ser um `computed` simples que escolhe entre `placeholder`
e `placeholderIfEmpty` conforme `hasItems()`.

### Validação do valor fora do setter

O `FormSelect` atual valida no setter (`form-select.ts:39-44`): se o valor não
existe em `options`, ele é **ignorado**. Isso é um bug latente com opções
assíncronas — o valor chega antes da lista e é descartado silenciosamente, sem
possibilidade de recuperação.

Seguir o que o multiple faz (`form-select-multiple.ts:44-63` e `:182-186`):
preservar o valor bruto no signal e filtrar apenas na **projeção** enviada ao
ng-select. O item volta a aparecer selecionado quando as opções chegarem.

Isso está registrado no spec como o cenário "Opções carregadas depois do
valor".

### Integração com `FormElementBase`

Três pontos que o multiple já resolveu e que se repetem aqui:

1. **Não usar `#element` no `<ng-select>`.** O `@ViewChild('element')` da base é
   tipado como `ElementRef<input|textarea|select>`; se a ref cair sobre um
   componente, o Angular resolve a instância e o `nativeElement.focus()` de
   `clear()` (`form-element-base.directive.ts:281`) quebra. Usar um
   `@ViewChild('ngSelect')` separado.
2. **`[ngModelOptions]="{ standalone: true }"`.** Sem isso o `ngModel` interno,
   que não tem `name`, lança erro em runtime dentro de um `<form [formGroup]>`.
3. **`[clearable]="false"`.** A limpeza usa o botão `app-button` do projeto, não
   o "×" do ng-select.

### SCSS

Copiar do multiple apenas o que se aplica:

- **manter**: `$arrow-width` / `$clear-width`, posicionamento absoluto do botão,
  `padding-right` condicionado a `.action-clear`, truncamento do texto da opção
  (`.option-text`);
- **descartar**: `$search-width`, regras de `.ng-value-container`, `.ng-value`,
  `.ng-input` e `.ng-value-icon`, e o `.value-summary`. Tudo isso existe por
  causa dos chips e do `flex-wrap` do modo múltiplo, que não têm equivalente no
  single.

Para o texto do item selecionado, o tema já aplica
`white-space/overflow/text-overflow` em `.ng-select-single .ng-value`
(`ng-select.component.scss`). O que falta é garantir que ele não passe por baixo
do botão de limpar — resolvido pelo mesmo `padding-right` do `.action-clear`.

### Unificar a condição do botão de limpar

O `form-select.html:11` tem o mesmo bug já corrigido no multiple: a classe
`action-clear` depende só de `hasValue()`, enquanto o `@if` do botão
(`form-select.html:27`) também checa `cleanable && isActive()`. Com `cleanable`
falso e um valor selecionado, o `padding` é aplicado sem que exista botão.

Adotar um único `computed` `showClear()`, usado pela classe e pelo `@if`.

## Riscos

- **`SelectItem` mora no arquivo que será reescrito.** A interface é declarada
  em `form-select.ts:9` e importada pelo multiple por caminho relativo
  (`form-select-multiple.ts:11`). A declaração e o `export` devem permanecer
  intactos no topo do arquivo; um `ng build` confirma.
- **Zoneless.** A aplicação usa `provideZonelessChangeDetection()`
  (`app.config.ts:12`). No multiple não foi preciso nenhum `markForCheck()`,
  então o mesmo é esperado aqui — mas precisa de confirmação em runtime,
  sobretudo ao digitar na busca.
- **Mudança de DOM.** Sai `<select>/<option>`, entra a árvore do ng-select.
  Nenhum teste ou CSS externo depende disso hoje, mas é uma quebra para
  qualquer consumidor futuro que assuma o elemento nativo.

## Escopo de arquivos

**Reescritos**
- `src/app/shared/ui/form-select/form-select.ts` (preservando `SelectItem`)
- `src/app/shared/ui/form-select/form-select.html`
- `src/app/shared/ui/form-select/form-select.scss`

**Alterados**
- `src/app/feature/showcases/pages/showcase-form-page/showcase-form-page.html`
  — corrigir `clearable` para `cleanable` e exercitar a busca

**Não alterados** — `form-select-multiple.*`, `_ng-select.scss`,
`src/app/shared/ui/index.ts`, `angular.json`.
