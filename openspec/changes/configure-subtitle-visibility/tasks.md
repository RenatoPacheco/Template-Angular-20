# Tasks

## 1. Configuracao da visibilidade

- [ ] 1.1 Expor `subtitleVisibility` como input tipado com default `normal`, e verificar bindings estaticos/dinamicos para `normal`, `fullscreen`, `hidden` e `windowed`
- [ ] 1.2 Sincronizar a classe de modo no player quando o input mudar e adicionar regras SCSS para ocultar somente `.vjs-text-track-display` nos modos restritos, verificando que track e controles permanecem ativos
- [ ] 1.3 Atualizar a demonstracao do showcase para permitir conferir os quatro modos durante a troca entre janela e tela cheia

## 2. Verificacao

- [ ] 2.1 Verificar que `normal` mostra a legenda nos dois modos, `fullscreen` somente em tela cheia, `hidden` em nenhum e `windowed` somente em janela
- [ ] 2.2 Rodar `npx tsc --noEmit -p tsconfig.app.json` e `npx ng build --configuration development`, verificando compilacao sem erros
- [ ] 2.3 Validar a change com `openspec validate "configure-subtitle-visibility" --strict`, verificando todos os cenarios da spec
