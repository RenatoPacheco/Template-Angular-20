# Tasks

## 1. Testes de comportamento antes das correções

- [x] 1.1 Criar `form-textarea.spec.ts` com testes para `readonly` e `disabled` ocultando o botão de limpar, e verificar com `ng test` que passam
- [x] 1.2 Adicionar teste de `rows` padrão (5) e de `rows` informado, e verificar com `ng test` que passam
- [x] 1.3 Adicionar teste de limpar devolvendo foco ao textarea e restaurando pristine e untouched, e verificar com `ng test` que passa

## 2. Botão de limpar oculto durante o carregamento

- [x] 2.1 Escrever teste que falha: com `loading` ativo e valor preenchido, o botão de limpar não é exibido, e verificar com `ng test` que falha antes da correção
- [x] 2.2 Adicionar `showActions` computed em `form-textarea.ts` (`isActive() && !loading`) e usá-lo em `form-textarea.html` no lugar de `isActive()`, e verificar com `ng test` que o teste de 2.1 passa
- [x] 2.3 Escrever teste de restauração: ao desativar `loading`, o botão de limpar volta a ser exibido, e verificar com `ng test` que passa

## 3. Valor vazio nulo

- [x] 3.1 Escrever testes que falham: apagar o texto digitado resulta em `null` no `FormControl`, e `setValue('')` resulta em `null` no `FormControl` com campo pristine, e verificar com `ng test` que falham
- [x] 3.2 Sobrescrever `normalizeValue` em `form-textarea.ts` para converter `''` em `null`, e verificar com `ng test` que a parte de digitação de 3.1 passa
- [x] 3.3 Sobrescrever `writeValue` em `form-textarea.ts` conforme a decisão 2 do design, e verificar com `ng test` que a parte de escrita programática de 3.1 passa

## 4. Limpezas

- [x] 4.1 Remover `FormsModule` dos imports de `form-textarea.ts` e verificar com `ng build` que a build conclui
- [x] 4.2 Trocar `public _rows` por `protected _rows` e verificar com `ng test` que os testes de 1.2 continuam passando

## 5. Integração

- [x] 5.1 Executar `ng test` completo e verificar que todos os testes passam
- [x] 5.2 Executar `ng build` e verificar que a build de produção conclui sem erros de template
- [x] 5.3 Revisar o uso de `app-form-textarea` no showcase (`src/app/feature/showcases/pages/showcase-form-page/showcase-form-page.html`) e em outros lugares do projeto, e registrar se algum depende de `''`
- [x] 5.4 Verificar com `git diff` que as alterações ficaram restritas a `src/app/shared/ui/form-textarea/` e à pasta do change

## Workflow follow-up

- Arquivar o change após revisão, e criar `openspec/specs/form-textarea/spec.md` a partir de `specs/form-textarea/spec.md`.
