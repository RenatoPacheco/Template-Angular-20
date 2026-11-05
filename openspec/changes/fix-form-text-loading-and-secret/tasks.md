# Tasks

## 1. Cobertura de testes do comportamento atual

- [x] 1.1 Adicionar testes em `form-text.spec.ts` para `readonly` e `disabled` ocultando os botões de ação, e verificar com `ng test` que passam
- [x] 1.2 Adicionar testes para `transform="cpf"` formatando o valor digitado e o model, e verificar com `ng test` que passam
- [x] 1.3 Adicionar testes para `enabled-helper` emitindo `helper` e para o clique no alerta emitindo `error` com as mensagens, e verificar com `ng test` que passam

## 2. Botões ocultos durante o carregamento

- [x] 2.1 Escrever teste que falha: com `loading` ativo e valor preenchido, o botão de limpar não é exibido, e verificar com `ng test` que falha antes da correção
- [x] 2.2 Adicionar `showActions` computed em `form-text.ts` (`isActive() && !loading`) e usá-lo em `form-text.html` no lugar de `isActive()`, e verificar com `ng test` que o teste de 2.1 passa
- [x] 2.3 Escrever teste de restauração: ao desativar `loading`, o botão de limpar volta a ser exibido, e verificar com `ng test` que passa

## 3. Modo secreto unificado

- [x] 3.1 Escrever testes que falham: `control-secret` inicia mascarado para `text` e `email` (input `password`, botão "mostrar"), e verificar com `ng test` que falham
- [x] 3.2 Escrever testes que falham para alternância: revelar em `email` volta ao tipo `email`; ocultar volta a `password`; `search` revelado vira `text`; campo sem `control-secret` não tem botões de alternância, e verificar com `ng test` que falham
- [x] 3.3 Substituir `showSecret`, `hideSecret` e `typeComputed` por `secretMode` (`none` | `masked` | `revealed`) em `form-text.ts` e ajustar `form-text.html`, e verificar com `ng test` que os testes de 3.1 e 3.2 passam
- [x] 3.4 Ajustar `clear()` para voltar a `masked` quando `control-secret` estiver habilitado, escrevendo teste antes e verificando com `ng test`

## 4. Valor vazio nulo

- [x] 4.1 Escrever testes que falham: apagar o texto digitado resulta em `null` no `FormControl`, e `writeValue('')` resulta em `null`, e verificar com `ng test` que falham
- [x] 4.2 Sobrescrever `normalizeValue` em `form-text.ts` para converter `''` em `null`, e verificar com `ng test` que os testes de 4.1 passam
- [x] 4.3 Verificar que o teste existente de `limpar` continua passando e que `FormElementBase` não foi alterado (`git diff` restrito a `src/app/shared/ui/form-text/`)

## 5. Integração

- [x] 5.1 Executar `ng test` completo e verificar que todos os testes passam
- [x] 5.2 Executar `ng build` e verificar que a build de produção conclui sem erros de budget ou de template
- [x] 5.3 Revisar consumidores de `app-form-text` no projeto que usam `control-secret` ou dependem de `''` para campos vazios, e registrar os ajustes necessários antes do arquivamento

## Workflow follow-up

- Arquivar o change após revisão, e atualizar `openspec/specs/form-text/spec.md` com o conteúdo de `specs/form-text/spec.md`.
