# Design

## Context

`FormTextarea` estende `FormElementBase<string>`, como o `FormText` antes da correção. O template usa `[readonly]="readonly || loading"` no `<textarea>`, mas o botão de limpar depende de `@if (isActive())`, que ignora `loading`. Não há `normalizeValue` nem `writeValue` próprios, então string vazia chega ao `FormControl` como `''`. Não existe spec de teste para o componente. Ver proposal.md, seção Why.

A correção espelha a do `app-form-text`, implementada no change `fix-form-text-loading-and-secret`, e a capability de comportamento fica separada em `specs/form-textarea/spec.md`.

## Goals / Non-Goals

**Goals:**
- Botão de limpar oculto enquanto `loading` estiver ativo.
- Valor vazio vira `null` no `FormControl`, na digitação e na escrita programática, sem marcar o campo como alterado.
- Testes de `loading`, `readonly`, `disabled`, valor vazio e limpar, escritos antes das correções.

**Non-Goals:**
- Não alterar `FormElementBase`, para não afetar editor, datepicker, select e checkbox.
- Não extrair uma base comum com `FormText` neste change. Isso fica para um change próprio, se um terceiro componente de texto aparecer.
- Não mudar o layout visual nem o SCSS além da limpeza de nomes.
- Não tratar acessibilidade (`aria-invalid`, `aria-describedby`).

## Decisions

**1. Lógica duplicada dentro de `FormTextarea`.**
Adicionar `showActions = computed(() => this.isActive() && !this.loading)` e usar `@if (showActions())` no template. Sobrescrever `normalizeValue` e `writeValue` com a mesma forma já usada no `FormText`.
- Alternativa: base comum `FormTextBase` para texto. Rejeitada agora por ser uma abstração nova para apenas dois componentes. Fica registrada como melhoria futura.
- Alternativa: alterar `FormElementBase`. Rejeitada por afetar consumidores sem verificação.

**2. `writeValue` explícito para vazio.**
Chamar `super.writeValue(value)` e, quando `value === ''`, reescrever o `FormControl` com `this.control?.setValue(null, { emitModelToViewChange: false })`. O `normalizeValue` já converte `''` em `null` no componente.
- O `FormControl` já tem `''` quando o `writeValue` roda, então é preciso reescrevê-lo. O `emitModelToViewChange: false` evita loop de volta para a view.
- Não usar `onChange(null)` para isso: ele marcaria o campo como dirty.

**3. Limpezas sem efeito de comportamento.**
- Remover `FormsModule`, que não é usado pelo template.
- Trocar `public _rows` por `protected _rows`, seguindo o padrão das demais propriedades.

## Risks / Trade-offs

- **[Breaking]** Textareas apagados passam a emitir `null` → Mitigação: buscar consumidores que comparem com `''` antes de implementar, incluindo o showcase.
- **[Risco]** Duplicação da lógica de vazio e de loading entre `FormText` e `FormTextarea` → Mitigação: testes espelhados nos dois componentes; extração para base comum fica como melhoria futura.
- **[Risco]** Sem testes existentes, a regressão de `rows` ou do `transformNumber` pode passar despercebida → Mitigação: incluir teste de `rows` padrão no spec de teste.

## Migration Plan

Entrega em um único commit de `fix(form-textarea)`. Rollback é reverter o commit. Não há migração de dados.

## Open Questions

Nenhuma.
