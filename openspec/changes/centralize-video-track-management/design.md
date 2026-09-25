# Design

## Context

`video-track-selector.ts` atualmente exporta a função `watchVideoTrackChanges`, que observa mudanças de faixas de áudio e legendas, enquanto `Video` mantém referências a faixas remotas de legenda e sincroniza sua lista. A barra de controle já contém o botão de capítulos, mas o componente ainda não aceita nem registra faixas `chapters`. Este change renomeia o módulo para `video-track.ts` e consolida nele a gestão descrita em `proposal.md`.

## Goals / Non-Goals

**Goals:**
- Unificar o ciclo de vida de faixas remotas e os observadores relacionados em um objeto cuja duração corresponde à do player.
- Suportar configuração e atualização de faixas `subtitles`, `chapters` e `metadata` através do mesmo modelo de metadados já usado por legendas.
- Preservar os eventos públicos de faixa de áudio, legenda selecionada e texto da legenda.
- Emitir os cues ativos das faixas metadata para o consumidor sem renderizá-los como legenda.
- Disponibilizar operações de parsing, serialização e criação de Blob WebVTT reutilizáveis no browser.
- Reutilizar o botão de capítulos da barra Video.js.
- Agrupar os formulários das três categorias em uma seção própria do showcase, separada das opções de vídeo e reprodução.

**Non-Goals:**
- Adicionar gerenciamento de faixas de áudio ou vídeo remotas neste change.
- Criar controles de capítulos customizados, miniaturas de preview ou edição de cues.
- Alterar o formato ou o contrato existente da entrada `subtitleTracks`.

## Decisions

- Renomear `video-track-selector.ts` para `video-track.ts` e converter sua função em uma classe `VideoTrack`, instanciada com o player e callbacks de eventos. A classe manterá as referências dos elementos/faixas remotas que ela própria adicionou, sincronizará as listas por tipo e removerá somente as faixas gerenciadas por ela. Isso mantém a implementação de seleção e de ciclo de vida no mesmo módulo; a alternativa de deixar registros em `Video` perpetuaria a divisão atual de responsabilidades.
- Reutilizar o tipo público atual `{ src, srclang, label }` para legendas, capítulos e metadata, definindo o `kind` ao registrar cada lista (`subtitles`, `chapters` ou `metadata`). `Video` manterá `subtitleTracks` e receberá entradas paralelas `chapterTracks` e `metadataTracks`, preservando compatibilidade dos consumidores existentes.
- Para metadata, definir a faixa no modo oculto para receber `cuechange` sem desenhar texto na tela. O callback público `metadataCueChange` enviará `{ label, language, cues }`, mantendo os objetos de cue do Video.js para preservar os respectivos dados e tempos.
- Implementar `VideoVtt` em `video-vtt.ts` com modelo de cue normalizado (`id` opcional, tempos em segundos e texto preservado). O parser aceitará cabeçalho WebVTT, identificadores opcionais, timestamps e texto de múltiplas linhas; conteúdo textual de cues metadata, inclusive JSON, será tratado como texto opaco. Entrada estruturalmente inválida causará erro explícito, evitando perda silenciosa de cues.
- Serializar o modelo normalizado em WebVTT e construir um `Blob` de MIME type `text/vtt`; não haverá escrita direta no filesystem nem fetch de URLs na classe. A leitura remota continua a cargo do Video.js, enquanto o utilitário atua sobre strings/cues recebidos do chamador.
- No showcase, colocar os controles de subtítulos, capítulos, metadata e a visualização/registro de cues metadata em um fieldset dedicado com a legenda “Faixas do vídeo”. Isso distingue configuração de faixas dos controles gerais e mantém as categorias relacionadas juntas.
- Criar a instância do gerenciador quando o player estiver pronto, aplicar as listas atuais e enviá-las ao gerenciador quando as entradas mudarem. No encerramento, o componente chamará a limpeza do gerenciador antes de descartar o player.
- Manter as faixas sem seleção automática. O menu de legendas existente continua oferecendo a opção desativada; a navegação de capítulos será fornecida pelo botão `chaptersButton` já configurado e só ficará disponível quando houver uma faixa de capítulos válida com cues. Faixas metadata ficam ocultas e não entram nesses menus.
- Separar observação de seleção do registro remoto dentro da classe, mas expor callbacks equivalentes aos outputs existentes. Para capítulos, não será adicionado output novo: a navegação/seek é comportamento do controle Video.js.

## Risks / Trade-offs

- [Uma faixa remota pode permanecer no player depois de uma atualização] → Cobrir sincronização de inclusão, substituição e remoção, guardando e removendo a referência `TextTrack` correta para cada elemento remoto.
- [Faixas de capítulos inválidas ou sem cues não habilitam navegação útil] → Filtrar metadados vazios e validar o comportamento com uma faixa de capítulos VTT no showcase; o carregamento e parsing continuam responsabilidade do navegador/Video.js.
- [A refatoração pode alterar outputs já consumidos] → Preservar assinaturas e verificar a seleção de áudio/legenda e a limpeza de texto ao desligar a legenda.
- [Cues metadata têm estrutura variável por origem] → Emitir cues Video.js sem reduzir o conteúdo a texto ou impor um formato específico ao consumidor.
- [O formato WebVTT tem casos de sintaxe além dos arquivos de demonstração] → Cobrir cabeçalho, IDs opcionais, timestamps válidos e texto multiline em testes; rejeitar sintaxe não suportada com erro explícito, sem descartar dados parcialmente.

## Migration Plan

Não há migração de dados. `subtitleTracks` e os outputs existentes permanecem compatíveis; `chapterTracks` e `metadataTracks` serão opcionais, e `metadataCueChange` será um output aditivo. `VideoVtt` é uma API nova e independente do ciclo de vida do player. Caso seja necessário reverter, remover os novos inputs/outputs, o utilitário e restaurar a função observadora anterior, mantendo o contrato atual de legendas.
