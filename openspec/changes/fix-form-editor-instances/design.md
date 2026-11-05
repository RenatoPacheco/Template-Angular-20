# Design

## Context

`FormEditor` (CKEditor 4 via `ckeditor4-angular`) renderiza um de três blocos `<ckeditor>` conforme `isActive()` e `isMobile`. Trocar de bloco destrói uma instância e cria outra. Em `emitReady`, cada instância é adicionada a `this.editors`, e nada a remove. `maximize()` percorre essa lista e, em exceção, chama `window.location.reload()`. Ver proposal.md, seção Why.

## Goals / Non-Goals

**Goals:**
- Instâncias destruídas saem de `this.editors`.
- Falha ao maximizar fica contida ao editor afetado, sem recarregar a página.
- Confirmar a causa do erro com um spike antes de fechar a correção.

**Non-Goals:**
- Não alterar valor, foco, id, loading ou vazio. Isso fica para `fix-form-editor-focus-id-loading-empty`.
- Não unificar os três blocos de renderização neste change.

## Decisions

**1. Spike antes da correção final.**
A causa do erro ainda não foi reproduzida. O spike alterna mobile/desktop e editável/somente leitura, registra quais editores lançam erro em `getCommand` e se a página recarrega. O resultado define a correção da decisão 2.
- Alternativa: corrigir diretamente pela remoção da lista. Rejeitada, porque pode mascarar outra causa.

**2. Remover a instância quando o CKEditor destruí-la.**
Em `emitReady`, registrar um ouvinte no evento `destroy` do editor que remove a instância de `this.editors`. Esse caminho depende do que o spike confirmar sobre o ciclo de destruição.
- Alternativa: limpar a lista somente em `ngOnDestroy`. Rejeitada, porque a troca de bloco não passa por `ngOnDestroy` do componente.

**3. Falha contida ao editor.**
Em `maximize()`, o `catch` registra o erro com `console.error`, remove o editor com falha da lista e segue para o próximo. Remover `window.location.reload()`. Implementado e coberto pelo teste 2.2.
- Alternativa: manter o reload como último recurso. Rejeitada, porque recarrega a página inteira por um erro de um editor.

**4. Voltar na navegação mantém a página.**
Quando o editor está maximizado, registrar uma entrada no histórico com `history.pushState` (com a mesma URL, para que o Angular ignore a navegação). O evento `maximize` do CKEditor entrega `data` = 1 ao maximizar e 2 ao minimizar, confirmado no navegador. Ao receber 1, registrar a entrada. Ao receber 2 sem ter vindo do voltar, chamar `history.back()` para remover a entrada. No `popState` com entrada pendente, marcar a entrada como consumida e minimizar sem chamar `history.back()`. No `ngOnDestroy`, marcar a entrada como consumida antes de minimizar, para não navegar sozinho.
- Efeito colateral: ao sair do componente com o editor maximizado, a entrada permanece no histórico. Um voltar a mais pode ser necessário para chegar à página anterior. Isso não é coberto por teste automatizado.
- A ignorância do Angular para navegação com a mesma URL precisa ser confirmada manualmente (tarefa 4.3).

## Risks / Trade-offs

- **[Risco]** O spike pode mostrar outra causa, como a ordem entre `destroy` e `ready` → Mitigação: a decisão 2 só é fechada após o spike, e o `design.md` é atualizado antes da implementação.
- **[Risco]** Remover o `reload` pode esconder falhas reais → Mitigação: registrar o erro com `console.error` e cobrir o caminho de erro em teste.

## Migration Plan

Entrega em um commit `fix(form-editor): ...`. Rollback é reverter o commit.

## Open Questions

Evidência do spike (tarefa 1.1, parcial):
- Confirmado: a cada troca de modo (mobile/desktop ou editável/somente leitura), `this.editors` cresce em 1. As instâncias destruídas continuam na lista. Isso justifica a decisão 2 independentemente do erro.
- Não observado no navegador: nenhum erro no console durante as trocas. Como `maximize()` só roda em `resize`, `custon-save`, `popState` e `ngOnDestroy`, o `catch` com `window.location.reload()` não foi acionado nesse cenário.
- Achado no teste 2.1: ao destruir o componente, `ngOnDestroy` chama `maximize(false)`. Se a lista contém um editor cujo `getCommand` lança erro, o `catch` recarrega a página sem mensagem no console. Esse é o caminho silencioso do reload, e explica a falta de erro observada. Como a remoção no `destroy` impede que editores destruídos fiquem na lista, o reload deixa de ocorrer nesse caminho.
- Pendente: (a) voltar na navegação com editores trocados e (b) salvar (`custon-save`) depois das trocas. Esses testes decidem se a tarefa 3.2 (contenção de erro em `maximize()`) ainda é necessária, além da remoção no `destroy`.
