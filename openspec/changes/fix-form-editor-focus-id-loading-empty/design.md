# Design

## Context

`FormEditor` renderiza um de três blocos `<ckeditor>` conforme `isActive()` e `isMobile`. Os blocos complete e disabled têm `[id]`; o básico não. Os três repetem `(blur)`/`(focus)`, `(ready)` e `(change)`. O label não recebe `loading`. O setter `template` existe, mas nunca é chamado. Ver proposal.md, seção Why.

Este change depende de `fix-form-editor-instances` para a estrutura dos blocos. Os dois changes não devem editar o mesmo bloco ao mesmo tempo.

## Goals / Non-Goals

**Goals:**
- Marcar como tocado no blur, não no foco.
- Dar o mesmo `id` aos três blocos, para o label apontar para o editor em qualquer modo.
- Exibir `loading` no label.
- Remover o setter `template` sem alterar o comportamento visível.
- Definir o conjunto de HTML que representa vazio, depois de medir o CKEditor.

**Non-Goals:**
- Não alterar a lógica de instâncias e de maximizar (fica no change `fix-form-editor-instances`).
- Não trocar CKEditor por outro editor.

## Decisions

**1. Foco e blur.**
Remover `(focus)="emitBlur()"` dos blocos, mantendo `(blur)="emitBlur()"`.
- Alternativa: manter o foco. Rejeitada: é a causa do campo aparecer como tocado antes da saída.

**2. `id` em todos os blocos.**
Adicionar `[id]="id"` ao bloco básico.
- Alternativa: gerar um id separado para cada bloco. Rejeitada: o label precisa de um id único e estável.

**3. Loading no label.**
Passar `[loading]="loading"` ao `<label app-label>`, como em `form-text` e `form-textarea`.

**4. Remover `template` e reduzir duplicação.**
Remover o setter e o `_template`, e deixar a escolha entre `useCompleteConfig` e `useBasicConfig` depender só de `isMobile`. Os blocos continuam separados, porque a configuração do CKEditor é lida na criação da instância.
- Alternativa: um único `<ckeditor>` com `@switch`. Rejeitada: trocar `config` em runtime não reconfigura um editor já criado.

**5. Regra de vazio: somente `''`.**
A regra converte `''` em `null` em `normalizeValue` e em `writeValue`. Não há comparação de HTML com expressão regular, para não comprometer o desempenho a cada alteração do conteúdo.
- Alternativa: converter também HTML vazio (`<p></p>`, `<p>&nbsp;</p>`, `<br />`) com regex. Rejeitada pelo custo de desempenho a cada alteração.

## Risks / Trade-offs

- **[Risco]** Se o CKEditor devolver HTML vazio ao apagar, a regra de `''` não cobre esse caso → Mitigação: medição confirmou que o editor devolve `''` ao apagar todo o conteúdo (tarefa 2.1). Se outro caso aparecer, a decisão volta para discussão.
- **[Risco]** Remover `_template` pode quebrar um uso externo → Mitigação: verificar que o setter não é usado em nenhum consumidor antes de remover (hoje só o showcase usa `app-form-editor`, sem `template`).
- **[Risco]** Sem testes existentes, a regressão de visual não é detectada → Mitigação: testes de estado e configuração, e checagem manual no showcase.

## Migration Plan

Entrega em um commit `fix(form-editor): ...`, depois do change `fix-form-editor-instances`. Rollback é reverter o commit.

## Open Questions

- Resolvido: o CKEditor devolve `''` ao apagar todo o conteúdo (medição da tarefa 2.1). A regra sem regex cobre o caso.
