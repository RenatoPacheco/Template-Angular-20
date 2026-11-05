# Tasks

## 1. Spike de reprodução no navegador

- [x] 1.1 Rodar `ng serve`, abrir a página de showcase de formulários e alternar a largura da janela entre mobile e desktop, além de alternar o campo entre editável e somente leitura. Registrar em `design.md` (seção Open Questions) se algum editor lança erro em `getCommand` e se a página recarrega, verificando que a decisão 2 do design continua válida ou ajustando-a
- [x] 1.2 Registrar a causa confirmada no `design.md` e atualizar a decisão 2 se o spike mostrar outro caminho de destruição

## 2. Testes que falham antes da correção

- [x] 2.1 Criar `form-editor.spec.ts` com teste de que um editor destruído é removido da lista de editores, e verificar com `ng test` que falha antes da correção
- [x] 2.2 Adicionar teste de que um erro em um editor durante a operação de maximizar é contido e os demais editores continuam sendo operados, e verificar com `ng test` que falha antes da correção

## 3. Correções

- [x] 3.1 Em `emitReady`, registrar ouvinte no evento `destroy` do editor que remove a instância de `this.editors`, e verificar com `ng test` que o teste de 2.1 passa
- [x] 3.2 Em `maximize()`, tratar o erro por editor: registrar com `console.error`, remover o editor com falha da lista e seguir para o próximo, sem chamar `window.location.reload()`, e verificar com `ng test` que o teste de 2.2 passa
- [x] 3.3 Ao maximizar, registrar uma entrada no histórico (`history.pushState`) e, no `popState` com editor maximizado, minimizar e não navegar. Antes de implementar, verificar no CKEditor 4.22.1 qual evento ou estado sinaliza o início do modo maximizado (ver `design.md`, decisão 4)
- [x] 3.4 Ao minimizar pelo botão ou pelo salvar, tratar a entrada extra do histórico para que o próximo voltar não seja consumido, e verificar manualmente no showcase

## 4. Verificação

- [x] 4.1 Executar `ng test` completo e verificar que todos os testes passam
- [x] 4.2 Executar `ng build` e verificar que a build conclui
- [x] 4.3 Repetir o roteiro de 1.1 no showcase e verificar que a página não recarrega ao alternar os modos
- [x] 4.4 Verificar com `git diff` que as alterações ficaram restritas a `src/app/shared/ui/form-editor/` e à pasta do change

## Workflow follow-up

- Arquivar o change após revisão, e criar `openspec/specs/form-editor-instances/spec.md` a partir de `specs/form-editor-instances/spec.md`.
