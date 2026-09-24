# Design

## Context

Estado atual (branch `feature/migrate-video-to-app-video`): `app-video` passa `sources` ao `videojs()`; `controlBar.children` inclui `audioTrackButton` e `subsCapsButton`, que Video.js/VHS preenchem com as renditions do manifest. `public/video/hls.m3u8` declara 5 variantes de video, 5 audios e 4 legendas por `EXT-X-MEDIA`. VHS expoe `qualityLevels()` em runtime, mas `@types/video.js` nao tipa; o acesso fica isolado em interface local. Ver `proposal.md` para motivacao.

## Goals / Non-Goals

**Goals:**

- Interface do player localizada em pt-BR, incluindo strings acessiveis e o menu de qualidade.
- Expor selecao de audio e legendas ja declarados no manifest HLS.
- Qualidade HLS `auto` + fixa via input e via menu no grupo direito, sem reload e preservando posicao.
- Rotulos de nivel a partir do manifest, com fallback sem resolucao.

**Non-Goals:**

- Qualidade para MP4 progressivo (sem manifest nao ha niveis) — decidido com o usuario: HLS apenas.
- Edição/hospedagem de manifests ou playlists — consumidor fornece a URL do manifest HLS.
- Estilo custom do menu de qualidade alem do posicionamento no grupo direito.

## Decisions

1. **Reutilizar `audioTrackButton` e `subsCapsButton` com as faixas do manifest HLS, sem input paralelo de tracks.**
   Racional: o manifest ja e a fonte da verdade para idiomas, rotulos e defaults; VHS integra suas audio/text renditions ao modelo de tracks do Video.js. Duplicar esses dados em inputs VTT poderia divergir da selecao adaptativa do stream. O showcase local valida a integracao ponta a ponta.

2. **Isolar leitura e observacao de audio/text tracks em `video-track-selector.ts`.**
   Racional: esse arquivo concentra eventos `change`, `texttrackchange` e `cuechange`, mantendo `video.ts` como integrador dos outputs Angular. A funcao de setup retorna cleanup para remover listeners junto ao ciclo de vida do player.

3. **Fornecer traducoes locais Video.js em `video-pt-br.ts` e inicializar com `language: 'pt-BR'`.**
   Racional: a instalacao nao inclui bundle de idioma pt-BR. A tabela local cobre rotulos dos controles, menus e acessibilidade sem nova dependencia; o menu de qualidade usa `player.localize('Auto')` para respeitar essa localidade.

4. **Omitir `textTrackSettings` da lista de filhos do player.**
   Racional: Video.js so inclui o item “Subtitle Settings” quando o componente de configuracao de texto esta presente. Remover apenas esse child mantem `subsCapsButton`, selecao de idiomas e desligamento de legendas, sem criar CSS hack ou sobrescrever menu internamente.

5. **Seletor customizado como componente `MenuButton` video.js sobre `player.qualityLevels()`, sem plugin externo.**
   Racional: spike confirmou que `videojs-hls-quality-selector@2` funciona com v8, mas seu menu ignora renditions sem resolucao, nao contempla o fallback exigido e usa `levels_` privado; portanto nao cumpre o contrato. `qualityLevels()` tambem nao esta tipado em `@types/video.js`, entao o acesso fica isolado por interfaces locais. O componente usa os `MenuItem` nativos para preservar keyboard/a11y e skin. Alternativa de UI plugin rejeitada pela limitacao funcional; menu Angular fora da controlBar rejeitado por divergir da skin.

6. **`quality: 'auto' | string` (rotulo) como input live; `auto` = todos os niveis habilitados.**
   Racional: rotulo (`1080p`) e estavel para o consumidor; indice varia por manifest. Fixar = `enabled=false` nos demais niveis (padrao do ecossistema). Rotulo→nivel resolvido por altura (`height`) ou banda; inexistente cai para `auto` (spec).

7. **Rotulos `1080p/720p/...` de `height`; fallback `Alta/Media/Baixa` por ordem de banda.**
   Racional: manifests sem `RESOLUTION` ainda ordenam por `BANDWIDTH`; fallback evita menu vazio. `Auto` sempre primeira opcao.

8. **Faixas seguem o ciclo de vida do manifest; `quality` e input live.**
   Racional: ao trocar `src`, VHS reconstrui faixas de audio/legenda conforme o novo manifest; nao ha estado paralelo de faixas a reconciliar.

## Risks / Trade-offs

- [`qualityLevels()` sem tipos oficiais] → Mitigacao: shape isolado em `video-quality-selector.ts`, sem `any` espalhado.
- [HLS exige servidor com CORS + `application/x-mpegURL`] → Mitigacao: exemplo do showcase usa stream publica com CORS; documentado.
- [Manifest local aponta para playlists remotas] → Mitigacao: URLs atuais de audio/legenda/variantes sao HTTPS e devem responder com CORS; conferir no showcase.
- [Safari/navegadores com HLS nativo podem nao expor `qualityLevels()` ao VHS] → Mitigacao: habilitar `overrideNative` no VHS para reproduzir via VHS/MSE quando suportado; sem API de niveis, ocultar o seletor e manter reproducao.

## Migration Plan

1. Spike plugin comparado com o contrato; rejeitar plugin por nao suportar fallback sem resolucao e implementar botao custom.
2. Input `quality` + menu custom; audio/legendas providos pelo manifest do showcase.
3. `tsc` + `build` + validacao manual (troca de audio/legenda, fixa 480p, volta auto).
4. Rollback: reverter o commit (inputs opcionais, sem breaking).

## Open Questions

- Rotulo canonico quando `height` existe mas e incomum (ex.: 1080 vs 1080p)? Proposta: sempre `{height}p`; confirmar no spike com manifest real.
