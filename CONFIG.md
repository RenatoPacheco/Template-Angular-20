# Configuração

## Comandos iniciais

```sh
ng new angular-20-template --routing --style=scss --skip-tests --ssr=false --zoneless
```

### Sobre as opções

- `ng new angular-20-template`
	Cria um novo projeto Angular com o nome `angular-20-template`. Esse nome também vira a pasta raiz e o identificador base do projeto.

- `--routing`
	Gera o suporte de roteamento já no início (`app.routes.ts`), evitando configuração manual depois e deixando o template pronto para múltiplas páginas.

- `--style=scss`
	Define SCSS como pré-processador de estilos. A escolha facilita organização com variáveis, mixins e nesting, além de escalar melhor que CSS puro em projetos maiores.

- `--skip-tests`
	Não gera arquivos de teste iniciais (`*.spec.ts`) automaticamente. A intenção é manter o template mais enxuto no começo e adicionar testes conforme a estratégia do projeto.

- `--ssr=false`
	Desativa Server-Side Rendering na criação. Essa escolha reduz complexidade inicial de build/deploy quando o foco é aplicação cliente (SPA).

- `--zoneless`
	Cria o projeto sem Zone.js para detecção automática de mudanças. Em Angular moderno, isso pode melhorar previsibilidade e performance, com atualização de estado mais explícita.

### Resumo

Esse conjunto de opções prioriza um template moderno, leve e pronto para SPA com roteamento, SCSS e configuração mínima para começar rápido.

## Bootstrap

```sh
ng add @ng-bootstrap/ng-bootstrap
```