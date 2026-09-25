# Tasks

## 1. Gerenciador de faixas

- [x] 1.1 Renomear `video-track-selector.ts` para `video-track.ts` e convertê-lo na classe `VideoTrack`, que observa mudanças de áudio/legenda e centraliza cleanup; verificar com testes que callbacks existentes disparam e que os listeners são removidos ao destruir o gerenciador.
- [x] 1.2 Implementar sincronização de faixas remotas por tipo (`subtitles`, `chapters` e `metadata`), filtrando metadados incompletos e removendo apenas faixas próprias; verificar por testes inclusão, atualização e remoção sem duplicatas.
- [x] 1.3 Observar `cuechange` em faixas metadata e emitir `metadataCueChange` com `{ label, language, cues }`, mantendo as faixas ocultas; verificar por testes emissão, troca/remoção de faixas e limpeza do listener.

## 2. Integração com o componente Video

- [x] 2.1 Delegar à classe o gerenciamento de legendas existente sem alterar `subtitleTracks` nem os outputs públicos; verificar compatibilidade pelo build e testes de seleção/desativação.
- [x] 2.2 Adicionar entrada opcional de faixas de capítulos com URL, sigla e título e atualizar faixas quando os inputs mudarem; verificar no player a navegação do controle nativo por capítulos.
- [x] 2.3 Adicionar entrada opcional `metadataTracks` e output `metadataCueChange`, preservando `subtitleTracks` e outputs atuais; verificar que os cues metadata são emitidos e não aparecem como texto na tela.

## 3. Showcase e verificação integrada

- [x] 3.1 Criar no showcase um fieldset exclusivo “Faixas do vídeo” e mover para ele os controles de legendas, capítulos e metadata, separado das opções gerais; verificar visualmente o agrupamento.
- [x] 3.2 Adicionar ao showcase um FormArray de capítulos com ações de adicionar/remover e repassar a lista ao player; verificar configuração simultânea de legendas e capítulos.
- [x] 3.3 Adicionar ao showcase um FormArray de metadata com ações de adicionar/remover e visualizar/registrar os cues recebidos; verificar a configuração simultânea das três categorias.
- [x] 3.4 Executar `npx ng test` e `npx ng build`; confirmar testes e compilação sem erros e validar manualmente a navegação por capítulos e a emissão de cues metadata com arquivos VTT acessíveis.

## 4. Utilitário WebVTT

- [x] 4.1 Criar `VideoVtt` e o modelo público de cue normalizado; implementar parser de WebVTT para cabeçalho, identificadores opcionais, timestamps e texto multiline, rejeitando entrada inválida; verificar parsing e erros com testes.
- [x] 4.2 Implementar serialização dos cues e criação de `Blob` `text/vtt`, preservando textos de metadata como JSON opaco; verificar round-trip, cabeçalho e MIME type por testes.
- [x] 4.3 Exportar `VideoVtt` e os tipos de cue pela API pública de shared UI; verificar importação através de `@app/shared/ui` e confirmar `npx ng build`.
