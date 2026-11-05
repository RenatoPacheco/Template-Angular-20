# Design

## Context

`FormEditor` usa CKEditor 4 com três configurações: `completeConfig` (desktop), `basicConfig` (mobile) e `disabledConfig` (campo desabilitado ou somente leitura). Os plugins customizados do projeto ficam em `src/assets/ckeditor/plugins/` e são registrados em `src/index.html` com `CKEDITOR.plugins.addExternal`. O `custon-save` adiciona um botão e, ao ser acionado, dispara `editor.fire('change', 'custon-save', editor)`. `emitEditorChange` trata esse valor em `event.data`. Ver proposal.md, seção What Changes.

Em modo somente leitura, o CKEditor 4 desabilita por padrão os comandos cujo `readOnly` não foi declarado como `true`. Por isso o botão aparece desabilitado durante `loading`, que já passa `readOnly` ao editor.

## Goals / Non-Goals

**Goals:**
- Botão "Limpar" na barra do modo básico, com o mesmo efeito da ação `clear()` da base.
- Botão desabilitado em `loading` e ausente em `readonly` e `disabled`.
- Testes do tratamento da ação e da regra de loading.

**Non-Goals:**
- Não alterar `FormElementBase`.
- Não criar ícone binário novo. O botão usa texto.
- Não decidir o modo completo neste design, que fica em aberto abaixo.

## Decisions

**1. Plugin `custon-clear` no mesmo padrão do `custon-save`.**
O comando dispara `editor.fire('change', 'custon-clear', editor)`, e `emitEditorChange` passa a tratar `'custon-clear'` chamando `this.clear()`.
- Alternativa: o botão chamar diretamente o componente por um `output`. Rejeitada, porque o CKEditor só comunica ações ao Angular pelos eventos que o projeto já usa, e o padrão existente é esse.

**2. Ícone PNG na barra.**
O botão usa um ícone PNG na pasta `icons/` do plugin, no mesmo formato do `custon-save`, e o rótulo "Limpar" fica como texto de dica (tooltip). Esta decisão substitui a versão anterior, que usava só texto, porque o usuário pediu um ícone.
- Alternativa: manter só texto. Descartada pelo pedido de ícone.

**3. Gating de loading e readonly dentro do componente.**
O comando é desabilitado pelo próprio CKEditor quando o editor está em `readOnly`, que já inclui `loading`. Por segurança, o tratamento em `emitEditorChange` também ignora a ação quando `isActive()` é falso ou `loading` está ativo.
- Alternativa: confiar só no CKEditor. Rejeitada, porque o tratamento deve ser testável sem o CKEditor carregado.

**4. Modo completo: botão no grupo `clipboard` da barra padrão (alternativa A).**
O plugin `custon-clear` declara `toolbar: 'clipboard,1'`, e o `FormEditorComplte` inclui o plugin em `extraPlugins`. Com a barra padrão do CKEditor, o botão entra no grupo `clipboard`, como o salvar já faz. Escolha confirmada pelo usuário; a aparência no desktop ainda precisa de verificação visual (tarefa 5.3).
- Alternativa B (só modo básico) descartada, pois o usuário precisa do botão também no desktop.

## Risks / Trade-offs

- **[Risco]** `writeValue(null)` pelo `ngModel` pode não limpar o conteúdo do CKEditor → Mitigação: verificação manual na tarefa final, e teste do valor do `FormControl`.
- **[Risco]** Botão em texto pode não combinar com a barra visual → Mitigação: aceito por enquanto, e a troca por ícone fica como item separado.
- **[Risco]** O foco volta ao editor depois de limpar, mesmo quando o usuário clicou no botão → Mitigação: o comportamento é o mesmo do `clear()` dos outros campos, que também devolve o foco.

## Migration Plan

Entrega em um commit `feat(form-editor): botão de limpar`. Rollback é reverter o commit, sem migração de dados.

## Open Questions

- Modo completo: alternativa A ou B (decisão 4)? Precisa ser respondida antes da tarefa de configuração do `completeConfig`.
