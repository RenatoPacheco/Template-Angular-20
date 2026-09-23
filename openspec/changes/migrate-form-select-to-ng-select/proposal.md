# Migrar `FormSelect` para ng-select

## Por quê

O `FormSelect` (`src/app/shared/ui/form-select/form-select.ts`) ainda envolve um
`<select>` nativo, enquanto o `FormSelectMultiple` já foi migrado para
`@ng-select/ng-select`. Isso deixa três problemas concretos:

1. **Inconsistência visual.** Dois campos de seleção lado a lado na mesma tela
   (`showcase-form-page.html:86` e `:93`) renderizam com aparências diferentes:
   um é o `<select>` do sistema operacional, o outro é o ng-select tematizado.
2. **Sem busca.** O `<select>` nativo não permite filtrar opções, o que piora
   conforme a lista cresce.
3. **Contornos no código.** Para simular um placeholder, o componente injeta uma
   opção falsa `{ value: null, disabled: true }` no início da lista
   (`form-select.ts:98-101`), e resolve a seleção por **índice** do `<option>`
   (`form-select.ts:148-155`, `form-select.html:21`) em vez de por valor.

O tema do ng-select e a dependência já foram instalados e ajustados pela change
`add-form-select-multiple`, então o custo de infraestrutura desta migração já
está pago. Resta aplicar o mesmo tratamento ao single.

O risco é baixo: `app-form-select` tem **um único consumidor** em todo o
projeto, em `showcase-form-page.html:86`.

## O quê

Reescrever `form-select.{ts,html,scss}` sobre o ng-select, preservando o
contrato público do componente (herança de `FormElementBase<T>`, `options`,
`placeholder`, `placeholderIfEmpty`, `cleanable`, label/erro/helper) e o tipo do
valor (`T | null`).

Decisões já confirmadas com o solicitante:

- **Duplicar, não abstrair.** Nenhuma classe base comum entre single e multiple.
  Cada componente permanece autocontido.
- **Remover a opção sentinela.** O placeholder passa a ser o nativo do
  ng-select, e o texto deixa de existir como item da lista.
- **`searchable` com padrão `true`.** É o principal ganho funcional da migração.
- **Corrigir o showcase.** `showcase-form-page.html:89` passa `clearable="true"`,
  mas o input do componente se chama `cleanable` (`form-select.ts:50`) — hoje o
  botão de limpar simplesmente nunca aparece nessa demo.

## Não é escopo

- Extrair uma base comum (`FormSelectBase`) entre single e multiple.
- Unificar os dois num único componente com input `multiple`.
- Alterar `form-select-multiple.{ts,html,scss}`.
- Mover a interface `SelectItem` para `shared/models`. Ela continua declarada em
  `form-select.ts:9` e importada pelo multiple via caminho relativo
  (`form-select-multiple.ts:11`).
- Busca remota (`typeahead`), agrupamento (`groupBy`) e criação de itens
  (`addTag`).
- Testes automatizados: os schematics do projeto usam `skipTests: true` e não há
  suíte para os componentes de `shared/ui`.

## Impacto

- **Mudança de comportamento observável**, não apenas visual:
  - o texto de placeholder deixa de aparecer como `<option>` na lista;
  - o DOM renderizado muda de `<select>/<option>` para a árvore do ng-select,
    o que quebra qualquer seletor de teste ou CSS externo que dependa disso
    (não há nenhum hoje);
  - o campo passa a aceitar digitação para filtrar.
- `SelectItem` permanece exportada de `form-select.ts`; o `FormSelectMultiple`
  depende desse arquivo e não pode ser quebrado.
- Sem impacto no bundle: o tema do ng-select já é carregado globalmente por
  `src/styles/plugins/_ng-select.scss`.
