# Tasks

## 1. Padronizacao dos inputs

- [ ] 1.1 Converter `quality`, `autoplay`, `controls`, `loop`, `muted`, `preload`, `poster`, `playbackRate`, `playbackRates`, `fluid`, `width` e `height` para signal privado com `@Input` setter/getter no padrao de `src`/`sources`, verificando que cada nome publico e default permaneceu igual
- [ ] 1.2 Preservar transforms (`transformBoolean`, `transformNumber` e `transformOptionalNumber`), tipos e nullability nos setters, e verificar atributo estatico e property binding no showcase
- [ ] 1.3 Nos 14 setters, comparar o valor novo com o atual antes de `.set()` usando igualdade estrita; verificar que entrada primitiva repetida e a mesma referencia de array/objeto nao disparam uma nova atribuicao
- [ ] 1.4 Atualizar leituras internas para getters (sem `()`) e manter os efeitos lendo signals dos getters, verificando que mudancas de input continuam sincronizando o player em runtime

## 2. Verificacao

- [ ] 2.1 Rodar `npx tsc --noEmit -p tsconfig.app.json` e `npx ng build --configuration development`, verificando compilacao sem erros
- [ ] 2.2 Conferir no showcase que `src`, `sources`, inputs booleanos, numericos, dimensoes e qualidade continuam aceitos, sem alteracao observavel de comportamento
