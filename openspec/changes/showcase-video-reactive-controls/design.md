# Design

## Context

O showcase atual tem quatro cards de vídeo; o último usa `/video/hls.m3u8` e já está ligado aos logs dos outputs do player. `ShowcaseVideoPage` é standalone e importa apenas `Video`; o projeto já usa `FormBuilder` e `ReactiveFormsModule` em outros showcases. No contrato de `Video`, `fluid` e `playbackRates` são opções init-only, enquanto os demais inputs usados pelo player são sincronizados ao vivo. Ver `proposal.md` para motivação.

## Goals / Non-Goals

**Goals:**

- Demonstrar um único `app-video` HLS e tornar os inputs editáveis por formulário reativo.
- Cobrir entradas escalares, booleanas, fonte única/lista de fontes e lista de velocidades.
- Permitir play/pause imperativo e aplicar opções init-only sem reconstruir o player a cada digitação.

**Non-Goals:**

- Alterar o componente `Video`, sua API ou os controles do player.
- Substituir os logs de diagnóstico existentes ou criar testes automatizados do VHS.
- Incluir os três vídeos MP4 removidos em algum seletor de fontes; o HLS local permanece o recurso único demonstrado.

## Decisions

1. **Um `FormGroup` reativo tipado como fonte de verdade para os valores do showcase.**
   Racional: campos vinculados ao form atualizam os inputs do player no mesmo fluxo e evitam manter um segundo conjunto de propriedades soltas. Usar `ReactiveFormsModule`, `FormBuilder` e um signal derivado de `valueChanges` para compatibilidade com o app zoneless.

2. **Modo de fonte explícito: `src` simples ou `sources` estruturado.**
   Racional: o componente dá precedência à lista `sources` quando ela contém itens; o modo evita passar ambas as opções ativas e confundir o teste. A lista usa um `FormArray` de linhas com `src`/`type` e ações adicionar/remover.

3. **`playbackRates` editável como lista estruturada de números.**
   Racional: corresponde diretamente a `number[]` e evita parsing ambíguo de string. A taxa atual (`playbackRate`) fica em campo separado.

4. **Botões dedicados para `play()` e `pause()` via referência ao componente Video.**
   Racional: testa os métodos públicos sem simular cliques nos controles nativos. O formulário não altera os outputs; seus logs atuais seguem sendo registrados no console.

5. **Recriação explícita para opções init-only.**
   Racional: `fluid` e `playbackRates` só afetam a configuração na criação do player. Uma ação “Reinicializar player” desmonta/remonta o `app-video`, aplicando os valores atuais e reiniciando a reprodução; evitar recriação automática em cada alteração impede interrupções enquanto se edita.

6. **Demais inputs ligados como propriedades do player HLS.**
   Racional: source, quality, autoplay, controls, loop, muted, preload, poster, playbackRate, width, height e subtitleVisibility continuam usando os caminhos reativos normais de `Video`.

## Risks / Trade-offs

- [A lista `sources` pode conter URL/type inválidos] → Mitigação: validadores básicos e exibição do output `error` já registrado no showcase.
- [Reinicializar interrompe a posição atual] → Mitigação: botão explícito e indicação de que aplica `fluid`/`playbackRates` recriando o player.
- [Muitos campos tornam a página longa] → Mitigação: agrupar campos por fonte, reprodução, layout e faixas; usar grid responsivo Bootstrap.

## Migration Plan

1. Manter apenas o card HLS e inserir abaixo um formulário reativo agrupado.
2. Ligar os valores live; adicionar gestão de linhas de `sources`/`playbackRates` e comandos de reprodução.
3. Adicionar botão de reinicialização para aplicar `fluid`/`playbackRates` e preservar os logs existentes.
4. Rodar TypeScript/build e testar cada grupo de controles no showcase.
