# Design

## Context

Estado atual (branch `feature/migrate-video-to-app-video`): `app-video` passa `sources` ao `videojs()` sem `tracks` e sem nada de qualidade; `controlBar.children` fixo sem botoes de legenda/qualidade (captions so aparece com faixas; quality so com plugin). VHS embutido expoe `qualityLevels()` em runtime (26 ocorrencias no bundle), mas `@types/video.js` nao tipa — acesso exigira cast isolado. Sem plugin de seletor instalado. Ver `proposal.md` para motivacao.

## Goals / Non-Goals

**Goals:**

- Legendas WebVTT declarativas via input, com default e troca em runtime.
- Qualidade HLS `auto` + fixa via input e via menu no grupo direito, sem reload e preservando posicao.
- Rotulos de nivel a partir do manifest, com fallback sem resolucao.

**Non-Goals:**

- Qualidade para MP4 progressivo (sem manifest nao ha niveis) — decidido com o usuario: HLS apenas.
- Upload/hospedagem de `.vtt` ou `.m3u8` — consumidor fornece URLs.
- Estilo custom do menu de qualidade alem do posicionamento no grupo direito.

## Decisions

1. **`tracks: VideoTrack[]` repassado a opcao `tracks` do video.js (init) + `addRemoteTextTrack`/`removeRemoteTextTrack` no sync live.**
   Racional: opcao `tracks` e tipada (`TextTrackOptions[]`) e o botao de captions surge sozinho; mudancas pos-init usam a API de faixas remotas sem recriar o player. Alternativa (recriar player ao mudar tracks): rejeitada — perderia posicao e estado.

2. **Seletor de qualidade via plugin dedicado (ex.: `videojs-hls-quality-selector`) salvo spike; fallback: botao `MenuButton` custom sobre `player.qualityLevels()`.**
   Racional: o VHS expoe os niveis e `enabled` por nivel, mas nao traz UI; plugin evita reinventar menu, i18n e a11y. Spike na implementacao confirma compatibilidade com video.js v8 + `@types`. Alternativa (menu 100% Angular sobre o player): rejeitada — duplicaria posicionamento/skin fora da control bar.

3. **`quality: 'auto' | string` (rotulo) como input live; `auto` = todos os niveis habilitados.**
   Racional: rotulo (`1080p`) e estavel para o consumidor; indice varia por manifest. Fixar = `enabled=false` nos demais niveis (padrao do ecossistema). Rotulo→nivel resolvido por altura (`height`) ou banda; inexistente cai para `auto` (spec).

4. **Rotulos `1080p/720p/...` de `height`; fallback `Alta/Media/Baixa` por ordem de banda.**
   Racional: manifests sem `RESOLUTION` ainda ordenam por `BANDWIDTH`; fallback evita menu vazio. `Auto` sempre primeira opcao.

5. **Tracks e quality fora do init-only: ambos live; `sources` continua gatilho de troca de fonte (reseta faixas via novo `tracks`).**
   Racional: trocar `src` recarrega o tech — faixas vao junto na nova chamada; quality volta a `auto` em fonte nova salvo input explicito.

## Risks / Trade-offs

- [Plugin sem tipos ou incompatível com v8] → Mitigacao: spike primeiro; fallback botao custom (task separada); sem plugin, change nao avanca.
- [`qualityLevels()` sem tipos] → Mitigacao: cast isolado em helper tipado (`video-quality.ts`), sem `any` espalhado.
- [HLS exige servidor com CORS + `application/x-mpegURL`] → Mitigacao: exemplo do showcase usa stream publica com CORS; documentado.
- [Legenda `.vtt` sem CORS falha silenciosa] → Mitigacao: `error` com detalhe + player segue sem legendas (spec).
- [Nova dependencia npm] → Mitigacao: avaliar peso no bundle (budget inicial 500kB warning/1MB error na prod).

## Migration Plan

1. Spike plugin (instala + menu aparece em HLS de teste) ou fallback custom.
2. Inputs `tracks`/`quality` + sync live + exemplos no showcase.
3. `tsc` + `build` + validacao manual (troca de legenda, fixa 720p, volta auto).
4. Rollback: reverter o commit (inputs opcionais, sem breaking).

## Open Questions

- Rotulo canonico quando `height` existe mas e incomum (ex.: 1080 vs 1080p)? Proposta: sempre `{height}p`; confirmar no spike com manifest real.
