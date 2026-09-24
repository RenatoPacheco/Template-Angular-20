# Proposal

## Why

O `Video` esta em transicao: `src` e `sources` ja usam o padrao de `signal` privado com `@Input` setter/getter, enquanto os outros inputs continuam declarados com `input()`. Concluir a mesma convencao no componente facilita manutencao e deixa coerente a leitura dos valores dentro dos efeitos.

## What Changes

- Converter os outros inputs (`quality`, `autoplay`, `controls`, `loop`, `muted`, `preload`, `poster`, `playbackRate`, `playbackRates`, `fluid`, `width` e `height`) para signals privados expostos por `@Input` setter/getter, seguindo `src` e `sources`.
- Em todos os 14 setters, incluindo `src` e `sources`, comparar o valor novo com o atual antes de chamar `.set()`; usar igualdade estrita (arrays/objetos por identidade, sem deep comparison).
- Preservar nomes publicos, defaults, tipos e transforms existentes, inclusive conversao booleana/numérica e dimensoes opcionais.
- Adaptar leituras internas dos inputs para a API de propriedades (sem chamada de signal `()`), mantendo o efeito zoneless reativo.
- Manter outputs, player, showcase e comportamento externo inalterados.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

Nenhuma — refatoracao interna sem alteracao de comportamento ou contrato publico. A change declara `skip_specs: true`.

## Impact

- Afetado: `src/app/shared/ui/video/video.ts`.
- Sem novas dependencias, mudanca de template ou alteracao da sintaxe de uso de `<app-video>`.
- Compatibilidade esperada: bindings existentes permanecem iguais; transforms e valores default sao mantidos.
