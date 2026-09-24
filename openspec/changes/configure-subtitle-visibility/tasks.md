# Tasks

## 1. Configuracao da visibilidade

- [x] 1.1 Expor `subtitleVisibility` como input tipado com default `normal` e aceitar `fullscreen`, `hidden` e `windowed`
- [x] 1.2 Sincronizar a classe de modo no player quando o input mudar e adicionar regras SCSS que ocultam somente `.vjs-text-track-display`, sem alterar a seleção da faixa
- [x] 1.3 Atualizar a demonstracao do showcase para permitir conferir os quatro modos durante a troca entre janela e tela cheia

## 2. Verificacao

- [x] 2.1 Verificar que `normal` mostra a legenda nos dois modos, `fullscreen` somente em tela cheia, `hidden` em nenhum e `windowed` somente em janela
- [x] 2.2 Rodar `npx tsc --noEmit -p tsconfig.app.json` e `npx ng build --configuration development`, verificando compilacao sem erros
- [x] 2.3 Validar a change com `openspec validate "configure-subtitle-visibility" --strict`, verificando erros de formato nos artefatos
