# Tasks

## 1. Testes de comportamento atual

- [x] 1.1 Criar `form-editor.spec.ts` com testes de `normalizeValue` removendo `<p>` quando `paragraph` é falso, e verificar com `ng test` que passam
- [x] 1.2 Adicionar testes de `basicConfig`, `completeConfig` e `disabledConfig` com `height` informado e `paragraph` falso, e verificar com `ng test` que passam

## 2. Medição do conteúdo vazio

- [x] 2.1 Medir no navegador (verificação, não bloqueia mais a implementação): apagar todo o conteúdo do editor no showcase e confirmar que o valor emitido é `''`. Se for outro HTML vazio, registrar em `design.md` (decisão 5) e voltar para discussão

## 3. Testes que falham antes da correção

- [x] 3.1 Escrever teste que falha: foco no editor sem alteração mantém o campo não tocado, e verificar com `ng test` que falha antes da correção
- [x] 3.2 Escrever teste que falha: o bloco do modo mobile tem o mesmo `id` que o label, e verificar com `ng test` que falha antes da correção
- [x] 3.3 Escrever teste que falha: com `loading` ativo, o label exibe o indicador de carregamento, e verificar com `ng test` que falha antes da correção
- [x] 3.4 Escrever testes que falham: apagar o conteúdo e `setValue('')` resultam em `null` no `FormControl`, e `setValue('')` mantém o campo pristine, e verificar com `ng test` que falham

## 4. Correções

- [x] 4.1 Remover `(focus)="emitBlur()"` dos blocos, mantendo `(blur)`, e verificar com `ng test` que o teste de 3.1 passa
- [x] 4.2 Adicionar `[id]="id"` ao bloco básico em `form-editor.html`, e verificar com `ng test` que o teste de 3.2 passa
- [x] 4.3 Passar `[loading]="loading"` ao `<label app-label>`, e verificar com `ng test` que o teste de 3.3 passa
- [x] 4.4 Remover o setter `template`, o `_template` e o `useBasicConfig`/`useCompleteConfig` acoplados a ele, mantendo a escolha só por `isMobile`, e verificar com `ng test` que os testes de 1.x continuam passando
- [x] 4.5 Implementar a regra de vazio somente para `''` em `normalizeValue` e `writeValue`, e verificar com `ng test` que os testes de 3.4 passam

## 5. Verificação

- [x] 5.1 Executar `ng test` completo e verificar que todos os testes passam
- [x] 5.2 Executar `ng build` e verificar que a build conclui
- [x] 5.3 Verificar no showcase que o foco, o label e o loading se comportam como especificado
- [x] 5.4 Verificar com `git diff` que as alterações ficaram restritas a `src/app/shared/ui/form-editor/` e à pasta do change

## 6. Clique no label

- [x] 6.1 Escrever teste que falha: clicar no label de um editor habilitado move o foco para o editor, e verificar com `ng test` que falha antes da correção
- [x] 6.2 Escrever teste: clicar em um ícone do label não move o foco, e verificar com `ng test` que passa
- [x] 6.3 Guardar a referência do editor ativo em `ready`, limpar em `destroy`, e chamar `focus()` no clique do label quando o editor estiver habilitado e o clique não for em um ícone, e verificar com `ng test` que os testes de 6.1 e 6.2 passam

## Workflow follow-up

- Arquivar o change após revisão, e criar `openspec/specs/form-editor/spec.md` a partir de `specs/form-editor/spec.md`.
- Arquivar `fix-form-editor-instances` antes deste change, porque ele depende da estrutura de blocos alterada lá.
