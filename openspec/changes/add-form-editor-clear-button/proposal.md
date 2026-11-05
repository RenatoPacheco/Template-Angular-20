# Proposal

## Why

O `app-form-editor` é o único campo de texto do projeto sem botão de limpar. `app-form-text` e `app-form-textarea` têm o botão no canto do campo, e o usuário espera o mesmo comportamento no editor. Hoje a limpeza só é possível por seleção manual e exclusão do conteúdo.

## What Changes

- Novo plugin de CKEditor `custon-clear`, no mesmo padrão do `custon-save`, que adiciona o botão "Limpar" à barra de ferramentas e sinaliza a ação ao componente.
- O componente trata a ação chamando `clear()` da base: o valor vai para `null` no `FormControl`, o campo volta a pristine e untouched, e o editor recebe o foco.
- O botão fica desabilitado enquanto `loading` ou `readonly` estiverem ativos, e não é exibido quando o campo está desabilitado.
- Adição do botão à barra do modo básico (mobile). A inclusão no modo completo depende de decisão registrada no design.

## Capabilities

### New Capabilities

- `form-editor`: a capability já é declarada pelo change `fix-form-editor-focus-id-loading-empty`. Este change adiciona requisitos ao mesmo arquivo de spec, usando `ADDED`. Se o change de foco for arquivado antes, a capability já existe no main spec.

### Modified Capabilities

<!-- Nenhuma capability existente em openspec/specs/ tem requisitos alterados. -->

## Impact

- `src/assets/ckeditor/plugins/custon-clear/` (novo plugin) e `src/index.html` (registro do plugin).
- `src/app/shared/ui/form-editor/form-editor.model.ts` (`extraPlugins` e barra de ferramentas do modo básico).
- `src/app/shared/ui/form-editor/form-editor.ts` (tratamento da ação) e o `form-editor.spec.ts`.
- Não há mudança em `FormElementBase`.
- Ordem: o change `fix-form-editor-focus-id-loading-empty` deve ser arquivado antes deste, para que os dois não editem a mesma spec ao mesmo tempo.
