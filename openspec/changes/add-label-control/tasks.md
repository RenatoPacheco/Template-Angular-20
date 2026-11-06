# Tasks

## 1. Regra de erro compartilhada

- [x] 1.1 Criar a função pura `isErrorVisible(control, enabledError)` em `src/app/shared/utils/` com testes em `src/app/shared/utils/` cobrindo: inválido, tocado e alterado com `enabledError` verdadeiro retorna verdadeiro; qualquer condição falsa retorna falso; controle nulo retorna falso. Verificar com `ng test`
- [x] 1.2 Exportar a função pelo barrel de `shared/utils` (se existir) e verificar com `ng build` que a build conclui

## 2. Label: estado por propriedade e vínculo com controle

- [x] 2.1 Adicionar o input `state` (`'valid' | 'invalid' | null`) com setter e signal no padrão dos outros inputs, e aplicar `is-valid` e `is-invalid` no host por `[class.is-valid]` e `[class.is-invalid]`. Escrever antes em `src/app/shared/ui/label/label.spec.ts` os cenários de "Estado visual por propriedade" e "Sem estado", e verificar com `ng test` que passam
- [x] 2.2 Adicionar o input `control` com setter que cancela a assinatura anterior, assina `control.events` com `takeUntilDestroyed` e copia `status`, `touched` e `pristine` para signals. Escrever antes em `label.spec.ts` os cenários de "Erro a partir de um controle" (visível após interação, oculto antes da interação, acompanha o controle, troca de controle) e verificar com `ng test`
- [x] 2.3 Implementar a precedência: `state` não nulo prevalece sobre o estado calculado; `enabled-error` falso suprime o erro mesmo com `control`. Escrever antes em `label.spec.ts` o cenário "Estado explícito sobre o controle" e um caso com `enabled-error` falso, e verificar com `ng test`
- [x] 2.4 Ligar o ícone de erro em `label.html` à função `isErrorVisible` quando há `control`, mantendo o `enabled-error` atual quando não há `control`. Verificar com `ng test` que os testes do grupo 2 seguem passando

## 3. Label: toast e saída de erro

- [x] 3.1 Injetar `ValidatorService` e `ToastService` no `Label` e verificar com `ng build` que não há dependência circular entre `shared/ui` e `@app/core`. Se houver ciclo, importar direto do arquivo do serviço em vez do barrel
- [x] 3.2 Escrever antes em `label.spec.ts` os cenários de "Toast gerado pelo label com controle" (controle inválido gera toast com as mensagens; controle válido não cria toast vazio) e "Pai trata o erro" (sem `control`, emite só `error`, sem toast). Implementar o clique para gerar o toast quando há `control` e emitir a saída `error` com as mesmas mensagens nos dois casos. Verificar com `ng test`
- [x] 3.3 Confirmar em `label.spec.ts` que a saída `error` continua sendo emitida com as mensagens quando há `control`, para que pais que escutam `(error)` sigam funcionando. Verificar com `ng test`

## 4. Integração e regressão

- [x] 4.1 Executar `ng test` completo e verificar que os testes existentes de `form-editor`, `form-radio`, `form-textarea`, `form-text` e demais componentes de `shared/ui` continuam passando
- [x] 4.2 Executar `ng build` e verificar que a build conclui sem erros de template
- [x] 4.3 Verificar no showcase, sem alterar os usos atuais, que os `label[app-label]` dos formulários mantêm a aparência e o comportamento de antes, incluindo o toast ao clicar no alerta de campo inválido

## Workflow follow-up

- Arquivar o change depois da revisão, com `openspec archive add-label-control`, para aplicar os deltas de `form-label` e `form-error-toast` aos specs principais.
- Em um change seguinte, ligar `[control]` e `[state]` nos componentes `form-*` e na `legend` de grupo do showcase.
