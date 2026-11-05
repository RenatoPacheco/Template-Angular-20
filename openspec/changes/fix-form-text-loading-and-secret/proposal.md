# Proposal

## Why

O componente `app-form-text` tem três comportamentos inconsistentes: o botão de limpar fica clicável enquanto o campo está em `loading`, o modo `control-secret` começa visível em campos `type="text"`, e campos apagados gravam `''` em vez de `null`. Além disso, a suíte de testes não cobre `transform`, `control-secret`, `loading`, `readonly`, `helper` e `error`, então esses comportamentos podem regredir sem aviso.

## What Changes

- Testes cobrindo `loading`, `readonly`, `transform`, `control-secret`, `helper` e `error` do `FormText`, escritos antes das correções.
- Durante `loading`, o botão de limpar e os botões de mostrar/ocultar ficam ocultos e não clicáveis, em alinhamento com o input que já fica somente leitura.
- Com `control-secret`, o campo sempre inicia mascarado, inclusive com `type="text"`.
- Valor vazio é normalizado para `null` no model, tanto ao digitar quanto ao limpar.
- Unificação da lógica de `showSecret`/`hideSecret`/`typeComputed` em uma única fonte de verdade.
- **BREAKING**: `control-secret` em `type="text"` passa a iniciar oculto. Consumidores que dependiam do estado inicial visível precisam ajustar.
- **BREAKING**: campos apagados passam a emitir `null` em vez de `''`.

## Capabilities

### New Capabilities

- `form-text`: comportamento do campo de texto de formulário (`app-form-text`), incluindo estado de carregamento, modo secreto, normalização de valor vazio e botões de limpar.

### Modified Capabilities

<!-- Nenhuma capability existente em openspec/specs/ tem requisitos alterados. -->

## Impact

- `src/app/shared/ui/form-text/form-text.ts`, `form-text.html`, `form-text.scss` e `form-text.spec.ts`.
- `FormElementBase` não é alterado. A normalização de vazio para `null` fica restrita ao `FormText`, para evitar impacto nos demais consumidores da base.
- Formulários que usam `control-secret` com `type="text"` ou dependem de `''` para campos vazios.
