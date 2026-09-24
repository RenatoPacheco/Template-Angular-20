# Design

## Context

Ver `proposal.md` (Why) para a motivação. Cadeia do bug, verificada por leitura do código:

- `label.html:8-11` renderiza `i[role="alert"]` com `(click)="emitError()"` quando `enabled-error`.
- `form-text.html:1-9` liga `(error)="emitError()"` ao `FormElementBase.emitError()`, que lê `control.errors`, chama `validator.getMessages(errors)` e passa a lista a `toast.error()` + saída `error`.
- `ValidatorService.getMessages()` filtra chaves fora do mapa (`validator.service.ts:25-27`).
- `ToastService.show()` itera as mensagens (`toast.service.ts:32-42`): lista vazia → zero toasts criados.
- `timeSpanValidator` retorna `{ invalidTimeSpan: true }` (mapa tem `timeSpan`); `dateTimeValidator` retorna `{ invalidDateTime: true }` (mapa tem `dateTime`). Demais validadores já usam a chave curta igual à do mapa.

## Goals / Non-Goals

**Goals:**

- Clique no alerta de `timeSpan`/`dateTime` inválidos abre o toast com a mensagem correta.
- Nenhuma outra notificação de erro muda de conteúdo ou comportamento.

**Non-Goals:**

- Mudar textos das mensagens, layout do toast ou do ícone de alerta.
- Defesa em `emitError()` contra listas vazias (sintoma, não causa; com as chaves alinhadas a lista nunca é vazia para esses casos).
- Revisar validadores além de `timeSpan`/`dateTime` (verificação de cobertura das chaves entra como task de checagem, sem mudança de código extra).

## Decisions

### 1. Renomear as chaves nos validadores, não acrescentar entradas no mapa

`invalidTimeSpan` → `timeSpan` e `invalidDateTime` → `dateTime`, seguindo a convenção já usada por `cpf`, `cnpj`, `date`, `alias` e `compare` (chave curta = chave do mapa).

- Alternativa considerada: adicionar `invalidTimeSpan`/`invalidDateTime` ao mapa de `ValidatorService`. Rejeitada: perpetuaria duas convenções de nome e deixaria o próximo validador livre para repetir o erro; a correção na origem elimina a classe do defeito nesses dois casos.
- `datetime.validator.ts:43-46` espalha `...(dateResult ?? {})` e `...(timeResult ?? {})` junto de `invalidDateTime` — como `dateValidator`/`timeSpanValidator` já retornam as chaves curtas, após o rename o objeto combinado carrega `dateTime` + `date`/`timeSpan` conforme a parte inválida, e o toast lista cada mensagem correspondente.

## Risks / Trade-offs

- [Risco] Consumidor lendo `errors?.invalidTimeSpan` / `errors?.invalidDateTime` diretamente quebra silenciosamente (passa a `undefined`) → Mitigação: task de busca por essas chaves em `src/` antes da mudança; busca na investigação não indicou uso fora dos validadores.
- [Trade-off] `datetime` inválido por parte de data gera duas mensagens (`dateTime` + `date`) — comportamento herdado da combinação atual, mantido; não é regressão.

## Migration Plan

Mudança de duas chaves de `ValidationErrors`, sem migração de dados. Rollback = reverter os dois hunks. Consumidores externos ao `src/` que dependam das chaves antigas precisam trocar para `timeSpan`/`dateTime`.

## Open Questions

Nenhuma.
