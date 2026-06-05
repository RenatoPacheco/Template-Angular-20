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

### Aplicando stylePreprocessorOptions

A configuração foi aplicada em `angular.json`, no caminho:

- `projects.angular-20-template.architect.build.options.stylePreprocessorOptions`

Trecho aplicado:

```json
"stylePreprocessorOptions": {
	"sass": {
		"silenceDeprecations": [
			"import"
		]
	}
}
```

Motivo da aplicação:

- O Sass marcou `@import` como deprecated e passa a emitir alertas no build.
- Dependências de estilo (incluindo ecossistema Bootstrap) podem acionar esse aviso, mesmo quando seu SCSS principal está correto.
- Com `silenceDeprecations: ["import"]`, o build fica mais limpo, sem poluir o terminal com alertas conhecidos.

Importante:

- Isso não corrige a causa raiz; apenas silencia o aviso.
- A correção definitiva é migrar imports legados para `@use`/`@forward` quando possível.
- Essa configuração foi definida em `build.options`; se quiser o mesmo comportamento em testes (`ng test`), replique também em `projects.angular-20-template.architect.test.options.stylePreprocessorOptions`.

