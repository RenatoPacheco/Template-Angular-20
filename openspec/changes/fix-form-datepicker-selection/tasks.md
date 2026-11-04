# Tasks

## 1. Sincronização do popup com o campo

- [x] 1.1 Ajustar `DatepickerField` para guardar o struct de qualquer data válida, sem checar `min`/`max`, e `null` para texto vazio, incompleto ou inválido; atualizar o comentário da classe (verificação: testes "Texto incompleto não seleciona" e "Data fora do limite não aparece selecionada" passam)
- [x] 1.2 Sincronizar o popup com `manualDateChange` em `writeValue`, `resetInternal` e nas limpezas de ponta do intervalo, passando o texto quando for data válida e `''` caso contrário (verificação: testes "Data válida após limpeza anterior" e "Campo vazio após reset" passam)
- [x] 1.3 Confirmar que a sincronização não altera o valor do formulário nem o estado `pristine` (verificação: teste de `FormDatepicker` que compara `control.value` e `control.pristine` antes e depois de `writeValue` e de `clear()`)

## 2. Limite cruzado do intervalo

- [x] 2.1 Garantir que `startMaxLimit` e `endMinLimit` usem o struct atual, sem preservar a última ponta válida (verificação: teste "Limite cruzado do intervalo" passa)

## 3. Mês de abertura

- [x] 3.1 Registrar o mês exibido pelo evento `navigate` em cada popup (única, início e fim) e passá-lo como `startDate` quando não há data selecionada (verificação: teste "Reabrir no último mês visto" passa)
- [x] 3.2 Usar o mês atual quando ainda não houve navegação (verificação: teste "Primeira abertura sem histórico" passa)
- [x] 3.3 Manter início e fim do intervalo com meses independentes (verificação: teste "Intervalo com meses independentes" passa)

## 4. Abertura com seleção e pelo teclado

- [x] 4.1 Verificar que abrir com data selecionada posiciona o popup no mês dela; se o ng-bootstrap não fizer isso, passar o struct como `startDate` nesse caso (verificação: teste de abertura com data válida passa)
- [x] 4.2 Verificar que a abertura por Alt+SetaParaBaixo mostra o mesmo estado que a abertura pelo botão, após limpar pelo botão de limpar (verificação: teste de teclado passa)

## 5. Integração

- [x] 5.1 Rodar `ng build` e `ng test` e confirmar que não há erro novo em relação à base atual (verificação: ambos terminam sem erro)
- [x] 5.2 Conferir no navegador o caso original (limpar, digitar, reabrir) e o intervalo (verificação: calendário reflete o campo, sem erro no console)

## Workflow follow-up

- Arquivar o change após a revisão e sincronizar `specs/form-datepicker/spec.md` com `openspec/specs/form-datepicker/spec.md`.
