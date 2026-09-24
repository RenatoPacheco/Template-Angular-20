# Tasks — `fix-timespan-error-toast`

## 1. Checagem de consumidores

- [x] 1.1 Buscar `invalidTimeSpan` e `invalidDateTime` em `src/` e confirmar que só ocorrem nos dois validadores (sem leitura direta de `control.errors` em componentes), e verificar que a busca retorna apenas `timespan.validator.ts` e `datetime.validator.ts`.

## 2. Correção das chaves

- [x] 2.1 Em `src/app/shared/validators/timespan.validator.ts`, trocar `{ invalidTimeSpan: true }` por `{ timeSpan: true }`, e verificar com `ng build` que o projeto compila sem erros.
- [x] 2.2 Em `src/app/shared/validators/datetime.validator.ts`, trocar `invalidDateTime` por `dateTime` nas duas ocorrências (incluindo o objeto combinado com `dateResult`/`timeResult`), e verificar com `ng build` que o projeto compila sem erros.
- [x] 2.3 Em `src/app/shared/validators/password.validator.ts`, trocar `errors['minLength']` por `errors['minlength']` (padrão do Angular e do mapa; defeito revelado pela auditoria 3.1, inclusão confirmada), e verificar com `ng build` que o projeto compila sem erros.

## 3. Auditoria de cobertura

- [x] 3.1 Cruzar todas as chaves retornadas pelos validadores de `src/app/shared/validators/*.validator.ts` com as chaves do mapa em `ValidatorService.messages`, e verificar que não resta nenhuma chave sem mensagem (anotar o resultado em `tasks.md`).
      > Auditoria via script: `compareRef`/`compareLabel` são payload da chave `compare` (falso-positivo); único gap real era `minLength` do password (corrigido em 2.3). Restante confere: `cpf`, `cnpj`, `date`, `dateTime`, `timeSpan`, `alias`, `compare`, `format`, `uppercase`, `lowercase`, `number`, `specialChar`, `minlength`, `maxlength`.

## 4. Verificação

- [x] 4.1 Rodar `ng build` e confirmar que não há erro de compilação.
- [x] 4.2 Validar manualmente em `/showcase/form`: digitar valor inválido em `timeSpan` e `dataHora`, clicar no ícone de alerta de cada um e confirmar que o toast exibe a mensagem correspondente; repetir com `cpf` e `data` como regressão, e anotar desvios em `tasks.md`.
