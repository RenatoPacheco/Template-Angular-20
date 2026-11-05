# Proposal

## Why

O componente `app-form-textarea` tem os mesmos problemas que o `app-form-text` tinha antes da correção: o botão de limpar continua clicável enquanto o campo está em `loading`, e o valor vazio é gravado como `''` no `FormControl` em vez de `null`. Além disso, o componente não possui nenhum teste automatizado, então esses comportamentos podem regredir sem aviso.

## What Changes

- Botão de limpar oculto enquanto `loading` estiver ativo, alinhado com o `<textarea>` que já fica somente leitura nesse estado.
- Valor vazio é `null` no `FormControl`, tanto na digitação quanto na escrita programática, com a mesma regra já adotada no `app-form-text`.
- Criação de `form-textarea.spec.ts` cobrindo `loading`, `readonly`, `disabled`, valor vazio e a ação de limpar, com testes escritos antes das correções.
- Limpezas sem efeito de comportamento: remover o `FormsModule` não utilizado e tornar `_rows` protegido.
- **BREAKING**: campos de textarea apagados passam a emitir `null` em vez de `''`. Consumidores que comparam com `''` precisam ajustar.

## Capabilities

### New Capabilities

- `form-textarea`: comportamento do campo de texto multilinha de formulário (`app-form-textarea`), incluindo estado de carregamento, valor vazio como `null` e ação de limpar.

### Modified Capabilities

<!-- Nenhuma capability existente em openspec/specs/ tem requisitos alterados. A capability form-text, criada no change fix-form-text-loading-and-secret, não é modificada aqui. -->

## Impact

- `src/app/shared/ui/form-textarea/form-textarea.ts`, `form-textarea.html`, `form-textarea.scss` e o novo `form-textarea.spec.ts`.
- Nenhuma alteração em `FormElementBase`. A regra de vazio fica restrita ao `FormTextarea`, para não afetar editor, datepicker, select e checkbox.
- O showcase (`src/app/feature/showcases/pages/showcase-form-page/showcase-form-page.html`) usa `app-form-textarea` e deve ser revisado após a mudança.
