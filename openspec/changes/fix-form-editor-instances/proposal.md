# Proposal

## Why

O `app-form-editor` (CKEditor 4) mantém uma lista `editors` de instâncias que nunca são removidas. Cada troca de bloco de renderização (mobile/desktop, editável/somente leitura) destrói um editor e cria outro, e os destruídos continuam na lista. O método `maximize()` percorre essa lista e, em qualquer exceção, chama `window.location.reload()`. Isso pode recarregar a página inteira ao alternar o modo do editor. A causa ainda não foi reproduzida no navegador.

## What Changes

- Instâncias de editor destruídas são removidas da lista de editores quando o CKEditor é destruído.
- Uma falha ao operar sobre um editor já destruído não recarrega a página; o erro é contido ao editor afetado.
- Antes de definir a correção final, um spike no navegador confirma a causa do erro ao alternar modos.

## Capabilities

### New Capabilities

- `form-editor-instances`: ciclo de vida das instâncias do editor de texto rico (`app-form-editor`), incluindo criação, troca de modo, destruição e operações de maximizar.

### Modified Capabilities

<!-- Nenhuma capability existente em openspec/specs/ tem requisitos alterados. -->

## Impact

- `src/app/shared/ui/form-editor/form-editor.ts` e `form-editor.html`.
- Nenhuma alteração em `FormElementBase`. O comportamento de valor e de vazio fica para o change `fix-form-editor-focus-id-loading-empty`.
- O showcase (`src/app/feature/showcases/pages/showcase-form-page/`) usa `app-form-editor` e deve ser checado manualmente após a mudança, alternando a largura da janela.
