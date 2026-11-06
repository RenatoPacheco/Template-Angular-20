# Spec Delta

## ADDED Requirements

### Requirement: Toast gerado pelo label com controle

Quando o label recebe `control`, o clique no ícone de erro SHALL exibir um toast de erro com uma mensagem para cada erro presente no controle, sem depender de o componente pai tratar a saída `error`.

#### Scenario: Clique no alerta com controle inválido

- **WHEN** o label recebe um controle inválido e o usuário clica no ícone de alerta
- **THEN** um toast de erro é exibido com as mensagens de todos os erros do controle

#### Scenario: Clique no alerta com controle válido

- **WHEN** o label recebe um controle sem erros e o ícone de alerta é clicado
- **THEN** nenhum toast vazio é criado
