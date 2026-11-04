# Spec Delta

## MODIFIED Requirements

### Requirement: Estados herdados do controle base

O componente DEVE respeitar `readonly`, `loading`, `size`, `id`, `class`, `label`, `enabled-error` e `enabled-helper`, e o estado desabilitado do `FormControl` (não existe input `disabled`), como os demais controles de `shared/ui`.

#### Scenario: Estado bloqueado

- **WHEN** o `FormControl` está desabilitado, ou `readonly` ou `loading` é verdadeiro
- **THEN** o campo não permite digitar, o botão de calendário não abre o popup e a ação de limpar não aparece

#### Scenario: Tamanho do campo

- **WHEN** `size` é `sm`, `md` ou `lg`
- **THEN** a altura e a tipografia do campo acompanham o equivalente `.form-control-{size}` do Bootstrap
