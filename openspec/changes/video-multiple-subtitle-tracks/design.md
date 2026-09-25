# Design

## Context

O componente `Video` configura o Video.js em `ngAfterViewInit` e expõe entradas Angular para as opções do player. O seletor de legendas e os eventos de mudança de faixa já estão configurados; atualmente não existe uma entrada de faixas remotas. O showcase usa Reactive Forms e atualiza as configurações do player por meio de signals.

## Goals / Non-Goals

**Goals:**
- Expor um tipo de faixa com sigla do idioma, URL e título, e uma entrada de lista no componente.
- Sincronizar mudanças na lista com as faixas remotas do Video.js, removendo as faixas anteriores antes de adicionar as atuais.
- Permitir no showcase a manutenção de uma lista de faixas sem limite artificial de quantidade.

**Non-Goals:**
- Hospedar, enviar ou converter arquivos de legenda.
- Criar mecanismo próprio de sincronização ou renderização de texto.
- Definir seleção automática de idioma com base em preferências do navegador.

## Decisions

- Representar cada faixa como objeto contendo `src` (URL), `srclang` (sigla) e `label` (título), mapeados aos campos esperados pela API de faixas de texto remotas do Video.js. Isso mantém a API pequena e alinhada aos metadados do padrão HTML; nomes alternativos de campos no showcase podem continuar sendo apresentados em português.
- Gerenciar a lista como entrada reativa: ao iniciar o player e sempre que a lista mudar, remover as faixas remotas gerenciadas anteriormente e adicionar apenas itens com os três campos preenchidos. Isso dá suporte a edições do showcase sem reinicializar todo o player e evita duplicatas.
- Não marcar faixas como padrão. A seleção permanece sob controle da pessoa usuária por meio do menu de legendas existente, incluindo a opção de desativá-las.
- Modelar no showcase a coleção com `FormArray`, com ações para adicionar e remover linhas. Campos com atualização no blur evitam reconfiguração enquanto a pessoa ainda digita.
- Os arquivos devem ser URLs acessíveis pelo navegador e compatíveis com faixas de texto do Video.js; não haverá upload nem processamento no cliente.

## Risks / Trade-offs

- [Remover faixas remotas incorretamente pode afetar faixas não gerenciadas pelo componente] → Manter referências apenas às faixas criadas por esta entrada e remover somente essas referências durante a sincronização.
- [Arquivos remotos podem falhar por CORS, URL inválida ou formato incompatível] → Deixar o carregamento a cargo do Video.js/navegador e documentar no showcase que o recurso apontado deve ser acessível e compatível.
- [Alterações frequentes podem recriar a lista de faixas] → Deduplicar e filtrar entradas inválidas antes de sincronizar; os campos do showcase atualizam no blur.

## Migration Plan

Não há migração de dados nem mudança incompatível prevista. A entrada de faixas será opcional e a ausência de faixas preservará o comportamento atual. Reverter consiste em remover a entrada, a sincronização e os controles correspondentes.
