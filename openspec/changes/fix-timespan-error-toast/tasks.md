# Tasks — `fix-timespan-error-toast`

## 1. Checagem de consumidores

- [ ] 1.1 Buscar `invalidTimeSpan` e `invalidDateTime` em `src/` e confirmar que só ocorrem nos dois validadores (sem leitura direta de `control.errors` em componentes), e verificar que a busca retorna apenas `timespan.validator.ts` e `datetime.validator.ts`.

## 2. Correção das chaves

- [ ] 2.1 Em `src/app/shared/validators/timespan.validator.ts`, trocar `{ invalidTimeSpan: true }` por `{ timeSpan: true }`, e verificar com `ng build` que o projeto compila sem erros.
- [ ] 2.2 Em `src/app/shared/validators/datetime.validator.ts`, trocar `invalidDateTime` por `dateTime` nas duas ocorrências (incluindo o objeto combinado com `dateResult`/`timeResult`), e verificar com `ng build` que o projeto compila sem erros.

## 3. Auditoria de cobertura

- [ ] 3.1 Cruzar todas as chaves retornadas pelos validadores de `src/app/shared/validators/*.validator.ts` com as chaves do mapa em `ValidatorService.messages`, e verificar que não resta nenhuma chave sem mensagem (anotar o resultado em `tasks.md`).

## 4. Verificação

- [ ] 4.1 Rodar `ng build` e confirmar que não há erro de compilação.
- [ ] 4.2 Validar manualmente em `/showcase/form`: digitar valor inválido em `timeSpan` e `dataHora`, clicar no ícone de alerta de cada um e confirmar que o toast exibe a mensagem correspondente; repetir com `cpf` e `data` como regressão, e anotar desvios em `tasks.md`.
