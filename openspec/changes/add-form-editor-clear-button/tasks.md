# Tasks

## 1. Testes de tratamento da ação antes da implementação

- [x] 1.1 Criar testes em `form-editor.spec.ts` para a ação `custon-clear`: com editor habilitado, o evento de `change` com esse valor limpa o valor do `FormControl` para `null` e deixa o campo pristine, e verificar com `ng test` que falham antes da correção
- [x] 1.2 Adicionar teste: com `loading` ativo, a ação `custon-clear` não altera o valor, e verificar com `ng test` que passa antes da correção (guarda contra regressão)
- [x] 1.3 Adicionar teste: com o campo em `readonly`, a ação `custon-clear` não altera o valor, e verificar com `ng test` que passa antes da correção

## 2. Plugin e barra do modo básico

- [x] 2.1 Criar `src/assets/ckeditor/plugins/custon-clear/plugin.js` seguindo o padrão do `custon-save`, com comando `custonClear` que dispara `editor.fire('change', 'custon-clear', editor)` e botão com rótulo "Limpar" na barra
- [x] 2.2 Registrar o plugin em `src/index.html` com `CKEDITOR.plugins.addExternal('custon-clear', ...)`
- [x] 2.3 Adicionar `custon-clear` a `extraPlugins` e à barra do `FormEditorBasic` em `form-editor.model.ts`, e verificar com `ng build` que a build conclui
- [x] 2.4 Adicionar o ícone PNG em `src/assets/ckeditor/plugins/custon-clear/icons/custon-clear.png` e referenciá-lo no plugin com `icons: 'custon-clear'`, como o `custon-save`, e verificar com `ng build` que a build conclui e no showcase que o ícone aparece na barra

## 3. Tratamento da ação

- [x] 3.1 Em `emitEditorChange`, tratar `'custon-clear'` chamando `clear()` quando `isActive()` for verdadeiro e `loading` estiver desativado, e verificar com `ng test` que os testes de 1.1 passam
- [x] 3.2 Verificar com `ng test` que os testes de 1.2 e 1.3 continuam passando

## 4. Modo completo (decisão pendente)

- [x] 4.1 Decidir entre a alternativa A e a B do `design.md` (decisão 4). Esta tarefa não é implementada até a decisão

## 5. Verificação

- [x] 5.1 Executar `ng test` completo e verificar que todos os testes passam
- [x] 5.2 Executar `ng build` e verificar que a build conclui
- [x] 5.3 Verificar no showcase que o botão aparece no modo básico, limpa o conteúdo, deixa o valor `null` e é desabilitado em `loading`
- [x] 5.4 Verificar com `git diff` que as alterações ficaram restritas a `src/assets/ckeditor/plugins/custon-clear/`, `src/index.html`, `src/app/shared/ui/form-editor/` e à pasta do change

## Workflow follow-up

- Arquivar o change `fix-form-editor-focus-id-loading-empty` antes deste, para que a capability `form-editor` esteja no main spec.
- Arquivar este change após revisão, e registrar os requisitos em `openspec/specs/form-editor/spec.md`.
