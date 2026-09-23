# Adicionar componente `FormSelectMultiple`

## Por quê

O `shared/ui` hoje só oferece seleção única através do `FormSelect`
(`src/app/shared/ui/form-select/form-select.ts:25`), que envolve um `<select>` nativo.
Não existe nenhum controle de seleção múltipla, então telas que precisam disso
recorrem a listas de checkbox ou a soluções ad hoc.

A dependência `@ng-select/ng-select@^20.0.1` já está declarada em `package.json:32`,
mas está **completamente sem uso**: nenhum `NgSelectModule` é importado em `src/`
e nenhum tema do ng-select está registrado em `angular.json` ou em `src/styles.scss`.
Ou seja, o custo da dependência já foi pago e o benefício nunca foi colhido.

## O quê

Criar o componente `FormSelectMultiple<T>` em
`src/app/shared/ui/form-select-multiple/` (o diretório já existe, vazio),
construído sobre o ng-select, seguindo o mesmo contrato dos demais controles
de formulário do projeto: herda de `FormElementBase`, integra com `app-label`,
erros, helper, `disabled`/`readonly`/`loading`/`size`.

Inclui também a configuração global única do ng-select: registro do tema e
overrides SCSS para alinhar a aparência ao Bootstrap 5 já usado no projeto.

Decisões já confirmadas com o solicitante:

- O valor do controle é sempre `T[]`; vazio é `[]` (nunca `null`).
- Tema `default` do ng-select em SCSS, com overrides de variáveis para casar
  com `.form-select` / `.form-control`.
- O `FormSelect` atual **não** será alterado nem migrado para ng-select.
- A demonstração entra na página existente `showcase-form-page`, sem rota nova.

## Não é escopo

- Migrar o `FormSelect` (seleção única) para ng-select.
- Corrigir o atributo `clearable` usado em `showcase-form-page.html:86`
  quando o input real se chama `cleanable` (`form-select.ts:50`) — bug pré-existente,
  registrado aqui apenas como observação.
- Busca remota / carregamento assíncrono de opções (`typeahead`), agrupamento
  (`groupBy`) e criação de itens novos (`addTag`).
- Testes unitários automatizados: os schematics do projeto usam `skipTests: true`
  e não há suíte de testes para os componentes de `shared/ui`.

## Impacto

- Novo componente público exportado pelo barrel `src/app/shared/ui/index.ts`.
- Mudança global de estilos: adicionar o tema do ng-select afeta qualquer uso
  futuro do `ng-select` na aplicação (hoje, nenhum).
- `angular.json` precisa ser alterado nas **duas** listas de `styles`
  (`angular.json:58` e `angular.json:117`).
- Orçamento de build de produção: 500kB de warning para o bundle inicial
  (`angular.json`); o tema do ng-select acrescenta CSS ao bundle global.
