# Tasks

## 1. Contrato de faixas de legenda

- [x] 1.1 Criar e exportar o tipo público de faixa de legenda com URL, sigla de idioma e título; verificar que o showcase consegue importá-lo pelo barrel `@app/shared/ui`.
- [x] 1.2 Adicionar ao `Video` uma entrada opcional de lista de faixas e sincronizá-la com faixas remotas do Video.js, filtrando itens incompletos e removendo apenas faixas anteriormente gerenciadas; verificar no player que mudanças não deixam faixas duplicadas.

## 2. Controles no showcase

- [x] 2.1 Adicionar ao formulário do showcase uma coleção dinâmica de legendas com campos para sigla, URL e título e ações para adicionar/remover; verificar que é possível manter múltiplas linhas.
- [x] 2.2 Passar a lista normalizada do formulário ao player e refletir edições/remoções sem reinicialização; verificar no seletor do player os títulos e idiomas configurados e a opção de desativar legendas.

## 3. Verificação integrada

- [x] 3.1 Executar `npx ng build` e confirmar que componentes, template e tipos compilam sem erros.
