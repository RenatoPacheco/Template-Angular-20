# Proposal

## Why

O `app-form-editor` tem problemas de acessibilidade, estado e consistência que afetam o uso do campo: o foco marca o campo como tocado antes de o usuário sair dele, o bloco do modo mobile não tem `id` e o label não aponta para o editor, o editor não mostra estado de carregamento, o setter `template` nunca é usado, e os três blocos de renderização repetem atributos. Além disso, o editor não tem testes automatizados.

## What Changes

- O editor marca o campo como tocado no blur, não no foco.
- O bloco de renderização do modo mobile recebe o mesmo `id` dos demais blocos, para que o label aponte para o editor.
- O label do editor exibe o estado de carregamento, como os demais campos.
- Remoção do setter `template` não utilizado e redução da duplicação dos blocos de renderização, sem alterar o comportamento visível.
- Regra de valor vazio: somente `''` vira `null`, em `normalizeValue` e em `writeValue`. Sem comparação de HTML com expressão regular, para não comprometer o desempenho.
- **BREAKING**: campos apagados passam a emitir `null` em vez de `''`.
- Criação de `form-editor.spec.ts` cobrindo a lógica de `normalizeValue`, as configurações e os estados de foco, id e loading.

## Capabilities

### New Capabilities

- `form-editor`: comportamento do campo de texto rico de formulário (`app-form-editor`), incluindo foco, identificação, estado de carregamento e valor vazio.

### Modified Capabilities

<!-- Nenhuma capability existente em openspec/specs/ tem requisitos alterados. -->

## Impact

- `src/app/shared/ui/form-editor/form-editor.ts`, `form-editor.html` e o novo `form-editor.spec.ts`.
- Nenhuma alteração em `FormElementBase`, para não afetar datepicker, select e checkbox.
- O showcase (`src/app/feature/showcases/pages/showcase-form-page/`) usa `app-form-editor` e deve ser revisado.
- Depende de a alteração de ciclo de vida do change `fix-form-editor-instances` ser feita primeiro, para que os dois changes não editem o mesmo bloco de renderização ao mesmo tempo.
