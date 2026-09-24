# Proposal

## Why

No `app-form-text` com `transform="timeSpan"`, um valor inválido marca o controle como inválido (rótulo vermelho + ícone de alerta), mas clicar no ícone não exibe nenhuma notificação. A cadeia clique → toast está quebrada só para esse caso: `timeSpanValidator` retorna `{ invalidTimeSpan: true }`, porém `ValidatorService.messages` só conhece a chave `timeSpan`. O `getMessages()` filtra chaves desconhecidas, resulta em `[]`, e `ToastService.show([])` não cria nenhum toast — o clique morre em silêncio.

O mesmo defeito existe em `dateTimeValidator` (retorna `{ invalidDateTime: true }`, o mapa só tem `dateTime`). Todos os demais validadores (`cpf`, `cnpj`, `date`, `alias`, `compare`) já usam a chave curta igual à do mapa.

## What Changes

- Renomear a chave de erro de `timeSpanValidator` de `invalidTimeSpan` para `timeSpan` (`src/app/shared/validators/timespan.validator.ts:20`), alinhando ao mapa de mensagens e à convenção dos demais validadores.
- Renomear a chave de erro de `dateTimeValidator` de `invalidDateTime` para `dateTime` (`src/app/shared/validators/datetime.validator.ts:24,44`), mesmo defeito (inclusão confirmada com o solicitante).
- Renomear a chave de erro de `passwordValidator` de `minLength` para `minlength` (`src/app/shared/validators/password.validator.ts:21`), mesmo defeito revelado pela auditoria (padrão do Angular e do mapa; inclusão confirmada com o solicitante).
- Sem mudanças em `FormElementBase.emitError()`, `ValidatorService`, `ToastService`, `Label` ou templates: com as chaves alinhadas, o fluxo existente (ícone → `error` → `getMessages()` → `toast.error()` → saída `error` com as mensagens) passa a funcionar.
- Validar no showcase (`/showcase/form`, controles `timeSpan` e `dataHora` com `transform` + validadores correspondentes) que o clique no alerta abre o toast com a mensagem.

## Capabilities

### New Capabilities

- `form-error-toast`: clicar no ícone de alerta de um campo inválido exibe um toast com as mensagens de todos os erros do controle; toda chave produzida pelos validadores do projeto tem mensagem correspondente no mapa.

### Modified Capabilities

- Nenhuma (`form-datepicker` é a única spec principal e não é afetada).

## Impact

- Duas linhas de comportamento em dois validadores (`timespan`, `datetime`); nenhuma assinatura muda (`ValidatorFn` continua retornando `ValidationErrors | null`).
- **Atenção a consumidores**: quem lia `control.errors?.invalidTimeSpan` / `invalidDateTime` diretamente precisa migrar para `errors?.timeSpan` / `errors?.dateTime`. Busca no `src/` não indica uso direto dessas chaves fora dos validadores (a verificar na implementação).
- Sem breaking change de API pública de componentes; sem dependências novas; sem migração de dados.
