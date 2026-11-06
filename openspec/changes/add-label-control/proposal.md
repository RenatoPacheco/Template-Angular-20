# Proposal

## Why

O `Label` (`label[app-label]`, `legend[app-label]`) hoje só mostra erro quando o componente de campo calcula o estado e o repassa por `enabled-error`. Isso impede dois usos: um `legend` de grupo de radios ou checkboxes, que não tem um componente de campo dono do erro, e qualquer rótulo que precise refletir o estado de um `FormControl` sem um wrapper. Além disso, as classes de estado `is-invalid` e `is-valid` existem no SCSS, mas nenhum código as aplica.

## What Changes

- O `Label` passa a aceitar `[control]` (`AbstractControl | null`). Quando o controle é informado, o label calcula sozinho se o erro deve aparecer, pela regra `INVALID && touched && dirty && enabledError`, e acompanha as mudanças do controle.
- O `Label` passa a aceitar `[state]` (`'valid' | 'invalid' | null`), aplicado como classe no host (`is-valid` ou `is-invalid`). Se `state` for informado, ele prevalece sobre o estado calculado a partir de `control`.
- Quando o `Label` tem `[control]` e o usuário clica no ícone de alerta, o próprio label exibe o toast com as mensagens de erro do controle. Sem `[control]`, o clique continua emitindo a saída `error` para o pai, como hoje.
- A regra de visibilidade do erro vira uma função pura compartilhada, usada pelo `Label`. O `FormElementBase` pode reutilizá-la, mas o comportamento dos componentes `form-*` não muda nesta etapa.
- **Fora do escopo:** os componentes `form-*` continuam passando `enabled-error` e não passam `[control]` ou `[state]`. Também não há mudança no template da `legend` do showcase. Ambos ficam para um change seguinte.

## Capabilities

### New Capabilities

- `form-label`: comportamento do rótulo de campos e grupos em `shared/ui`: texto, spinner de carregamento, ícones de ajuda e de erro, estado visual (`valid` e `invalid`) e vínculo opcional com um `FormControl` para mostrar o erro.

### Modified Capabilities

- `form-error-toast`: novo requisito. Um `label[app-label]` com `[control]` gera o toast ao clicar no alerta, a partir do próprio controle, sem depender de um pai que trate a saída `error`. O requisito atual não muda.

## Impact

- `src/app/shared/ui/label/label.ts`, `label.html` e `label.scss`: novos inputs, cálculo do erro, classes de estado e tratamento do clique quando há `control`.
- `src/app/shared/ui/label/label.spec.ts`: arquivo novo. Hoje a pasta não tem testes para o label.
- Helper compartilhado da regra de erro, em `src/app/shared/` (local a definir no design).
- `ValidatorService` e `ToastService` passam a ser usados também pelo `Label`.
- Sem mudança de API para os usos atuais: `label[app-label]` sem `[control]` e sem `[state]` se comporta como antes.
