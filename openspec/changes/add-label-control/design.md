# Design

## Context

O `Label` é um componente por atributo (`label[app-label], legend[app-label]`) e não tem `NgControl`. Ele fica num elemento irmão do campo (por exemplo, o `<textarea>` do `form-textarea`), então não consegue injetar o controle do campo. Hoje o erro é calculado no `FormElementBase.showError` e repassado por `enabled-error`. Ver `proposal.md` para a motivação e `specs/form-label/spec.md` e `specs/form-error-toast/spec.md` para os requisitos.

O `ValidatorService` e o `ToastService` já são injetados pelo `FormElementBase`, então já são fornecidos no ambiente em que os campos funcionam.

## Goals / Non-Goals

**Goals:**

- Permitir que um `label[app-label]` mostre o erro de um `FormControl` recebido por `[control]`, sem componente de campo.
- Permitir que o estado visual `valid` e `invalid` seja aplicado por `[state]`.
- Gerar o toast ao clicar no alerta quando o label tem `[control]`.
- Manter o comportamento atual de quem não usa `[control]` nem `[state]`.

**Non-Goals:**

- Alterar os templates de `form-text`, `form-textarea`, `form-select`, `form-select-multiple`, `form-datepicker` e `form-editor`.
- Alterar o template da `legend` do showcase.
- Tornar o ícone de ajuda e de erro acessível por teclado com `Espaço` ou trocá-los por `<button>`. Isso é outra revisão.
- Mudar a regra de quando o erro aparece. Ela continua `INVALID && touched && dirty`, agora em função compartilhada.

## Decisions

### Ponte entre o `FormControl` e os signals do label

O input `control` tem um setter. Ao receber um controle, o label cancela a assinatura anterior e assina `control.events` com `takeUntilDestroyed(destroyRef)`, copiando `status`, `touched` e `pristine` para signals. Com isso o template reage sem depender de `ChangeDetectorRef`, que o projeto não usa por causa do modo zoneless.

- Alternativa considerada: ler o controle direto no template. Descartada, porque o template não recebe notificação da mudança de `touched` e `pristine` em modo zoneless.
- Alternativa considerada: `effect` que lê `control.status`. Descartada, porque `status` não é signal e o `effect` não observaria as mudanças.

### Regra de erro compartilhada

A regra vira uma função pura, `isErrorVisible(control, enabledError)`, em `src/app/shared/utils/`, na mesma pasta de `transformBoolean`. O `Label` a usa com o controle recebido. O `FormElementBase.showError` poderia usá-la também, mas isso fica para o change seguinte, para este change não mexer no comportamento dos campos.

- Alternativa considerada: copiar a regra para dentro do `Label`. Descartada, porque duplicaria a condição e os dois lugares poderiam divergir.

### Precedência entre `state`, `control` e `enabled-error`

- `state` não nulo prevalece sobre tudo.
- Sem `state`, com `control`: o host recebe `is-invalid` quando `isErrorVisible(control, enabledError)` é verdadeiro. Não há `is-valid` automático, porque o fluxo atual não tem estado de sucesso.
- Sem `state` e sem `control`: nenhuma classe, exceto a que vier de outra fonte.
- `enabled-error` falso desliga o erro mesmo com `control`, como hoje.

### Toast com `control`, saída `error` mantida

Quando há `control`, o clique no alerta chama o `ValidatorService.getMessages` e o `ToastService.error`, usando o mesmo fluxo do `FormElementBase.emitError`. A saída `error` continua sendo emitida com as mesmas mensagens, para não quebrar pais que já a usam. Assim o pai que escuta `(error)` e o label com `[control]` não duplicam o toast, porque o pai só age na saída.

- Alternativa considerada: manter o toast só no pai. Descartada, porque a `legend` de grupo não tem pai com esse tratamento, e o objetivo é justamente o label funcionar sozinho.

### Estado por `state` como input simples

`state` é um input do tipo `'valid' | 'invalid' | null`, com o mesmo padrão de setter com signal dos outros inputs de `Label`. As classes saem do `[class.is-valid]` e `[class.is-invalid]` no host, para não conflitar com o `hostClass()` que monta `form-label`.

## Risks / Trade-offs

- **[Dependência circular]** O `Label` passa a importar `ToastService` de `@app/core`, e `core` pode importar algo de `shared/ui`. → Mitigação: verificar os imports antes de codar; se houver ciclo, mover a injeção para o ponto de uso ou importar direto do arquivo do serviço, não do barrel.
- **[Assinatura vazada]** Trocar de controle sem cancelar a assinatura anterior faria o label reagir ao controle antigo. → Mitigação: cancelar a assinatura anterior no setter e cobrir com o cenário "Troca de controle" em `label.spec.ts`.
- **[Duplo toast]** Um pai que mostra toast no `(error)` e um label com `[control]` poderiam mostrar dois toasts. → Mitigação: documentar que o label com `[control]` cuida do toast, e o pai não deve usar `(error)` para isso nesse caso. Os `form-*` não usam `[control]` neste change, então não há duplicidade agora.
- **[Mudança visual]** `is-invalid` passa a deixar o texto do label vermelho quando o erro é visível. Hoje o estilo existe mas não é aplicado. → Mitigação: essa é a intenção registrada em `label.scss`. Verificar visualmente no showcase, na `legend` de radios, antes de fechar o change.
- **[Regressão nos campos]** Os `form-*` não mudam nesta etapa, mas dependem de `Label` sem `[control]`. → Mitigação: o cenário "Pai trata o erro" e os testes atuais de `form-editor` e `form-radio` cobrem o caminho sem `control`.

## Migration Plan

Não há migração. Os usos atuais de `label[app-label]` não passam `[control]` nem `[state]`, então o comportamento não muda. Para desfazer, basta remover os inputs novos e o tratamento do clique com controle.

## Open Questions

Nenhuma. As decisões que mudariam requisitos ou tarefas foram resolvidas acima.
