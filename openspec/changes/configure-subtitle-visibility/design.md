# Design

## Context

O player encapsula um elemento Video.js; o texto renderizado das cues fica no filho `.vjs-text-track-display`. O estado de tela cheia é refletido pela classe `.vjs-fullscreen` do player. Ver `proposal.md` para motivacao.

## Goals / Non-Goals

**Goals:**

- Aplicar o modo escolhido ao texto renderizado das legendas em janela e tela cheia.
- Atualizar a visibilidade quando o input mudar, sem recriar o player.
- Manter a faixa e os controles de seleção de legenda ativos mesmo quando o texto estiver oculto.

**Non-Goals:**

- Alterar a seleção padrão de idioma ou o carregamento de tracks.
- Oferecer configurações de estilo, posição ou aparência das legendas.
- Mudar a política de visibilidade fora dos quatro valores declarados na spec.

## Decisions

1. **Modelar o modo como input `subtitleVisibility` com união literal e default `normal`.**
   Racional: mantém o valor validado pelo TypeScript, segue os inputs setter/getter do componente e preserva o comportamento atual por padrão.

2. **Traduzir os modos em classes no elemento raiz do Video.js e controlar `.vjs-text-track-display` via SCSS.**
   Racional: a classe `.vjs-fullscreen` acompanha as transições de fullscreen sem exigir listeners adicionais; as regras CSS mostram/escondem apenas o texto, sem desativar a faixa ou o menu. `normal` remove as classes de modo e deixa a skin sem restrição.

3. **Sincronizar classe apenas quando o valor do input mudar.**
   Racional: reutiliza o efeito existente do componente e evita recriação do player ou troca da faixa ativa.

## Risks / Trade-offs

- [Fullscreen nativo de plataforma pode não aplicar a classe `.vjs-fullscreen` da mesma forma] → Mitigacao: validar fullscreen e janela no showcase nos navegadores suportados; CSS continua limitado ao player.
- [Ocultar somente o texto deixa a faixa selecionada ativa] → Mitigacao: comportamento intencional; a faixa permanece selecionada e pode voltar a renderizar quando o modo mudar.

## Migration Plan

1. Adicionar input e sincronização de classe ao componente.
2. Adicionar regras SCSS para os três modos restritos.
3. Testar os quatro valores no showcase e rodar TypeScript/build.
4. Rollback: remover o input e as classes/regras relacionadas; consumidores voltam ao modo sempre visível.
