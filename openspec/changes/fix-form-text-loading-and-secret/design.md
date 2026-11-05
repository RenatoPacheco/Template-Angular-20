# Design

## Context

`FormText` estende `FormElementBase<string>` (`src/app/shared/directives/form-element-base.directive.ts`). A base decide `isActive()` (somente `readonly` e `disabled`) e fornece `normalizeValue`, usado por `writeValue` e `commitValue`. O template `form-text.html` renderiza os botões de ação com `@if (isActive())`, enquanto o `<input>` usa `[readonly]="readonly || loading"`. Ver proposal.md, seção Why.

## Goals / Non-Goals

**Goals:**
- Botões de ação (limpar, mostrar, ocultar) ficam ocultos enquanto `loading` estiver ativo.
- Com `control-secret`, o campo inicia mascarado para qualquer tipo de texto suportado.
- Valor vazio é `null` no model, tanto em digitação quanto em `clear()`.
- Testes cobrem `loading`, `readonly`, `transform`, `control-secret`, `helper` e `error` antes das correções.

**Non-Goals:**
- Não alterar `FormElementBase` nem o comportamento de outros componentes que herdam dela.
- Não mudar o layout visual dos botões nem o SCSS além do necessário.
- Não tratar acessibilidade (`aria-invalid`, `aria-describedby`) neste change.

## Decisions

**1. Loading oculta os botões dentro do `FormText`, não na base.**
Usar `showActions = computed(() => this.isActive() && !this.loading)` no componente e trocar `@if (isActive())` por `@if (showActions())` no template.
- Alternativa: alterar `isActive()` na base. Rejeitada porque afetaria todos os consumidores de `FormElementBase`.

**2. Secret unificado em um único modo.**
Substituir `showSecret`, `hideSecret` e `typeComputed` por um computed `secretMode` que retorna `'none' | 'masked' | 'revealed'`:
- `'none'`: `controlSecret` é falso. Tipo segue `type` normalmente, sem botão de alternância.
- `'masked'`: `controlSecret` é verdadeiro e o usuário não alternou. Tipo renderizado é `password` para qualquer `type` declarado; botão oferecido é "mostrar".
- `'revealed'`: `controlSecret` é verdadeiro e o usuário alternou. Tipo renderizado é o `type` declarado (`search` vira `text`); botão oferecido é "ocultar".
- `control-secret` vale para todos os tipos (`text`, `password`, `email`, `number`, `tel`, `url`, `search`).
- `typeComputed` passa a derivar só de `secretMode`.
- Alternativa: manter dois computeds com XOR. Rejeitada por ser difícil de raciocinar, conforme revisão anterior.

**3. Normalização de vazio dentro do `FormText`.**
Sobrescrever `normalizeValue(value)` em `FormText` para converter `''` em `null`, e sobrescrever `writeValue` para que, ao receber `''` do consumidor, o `FormControl` seja atualizado para `null` com `emitModelToViewChange: false`, sem marcar o campo como sujo.
- Como `commitValue` chama `normalizeValue`, a digitação que apaga o texto grava `null` no `FormControl`.
- Alternativa: alterar `normalizeValue` na base. Rejeitada por ter impacto em todos os consumidores sem necessidade para este change.
- O `Impact` da proposal deve ser ajustado para refletir essa decisão.

**4. Estado revelado é resetado ao limpar.**
`clear()` restaura `secretMode` para `'masked'` quando `controlSecret` é verdadeiro, pois o campo volta ao estado inicial.

## Risks / Trade-offs

- **[Breaking]** Formulários com `control-secret` em `type="text"` passam a iniciar mascarados → Mitigação: listar os usos no código antes de implementar e comunicar na release.
- **[Breaking]** Campos vazios emitem `null` → Mitigação: buscar consumidores que comparem com `''` antes de implementar.
- **[Risco]** Testes de regressão dependem do DOM dos botões (`app-button`) → Mitigação: selecionar por classe (`action-clear`, `action-show`, `action-hide`) já usada no template.

## Open Questions

- Nenhuma pendente que mude specs, abordagem ou tarefas. Ver pergunta aberta sobre tipos não textuais na resposta ao usuário.
