# Design

## Context

Os controles de `shared/ui` estendem `FormElementBase<T>` (em `shared/directives`), e o checkbox e o radio estendem `FormCheckBase` (que por sua vez estende a base). A base implementa `ControlValueAccessor` e obtém o `NgControl` com `inject(NgControl, { self: true, optional: true })`. Hoje a base expõe `@Input() value` (que escreve no modelo via `onChange`), `@Input() disabled` (que chama `control.enable()`/`disable()`) e um `ViewChild('element')` que assume um input nativo. O `FormCheckBase` contorna o eco de `value` sobrescrevendo o setter e reutiliza o nome `value` para o valor da opção.

Os consumidores usam sempre `formControl`/`formControlName`, então o modo standalone não é necessário. Veja `proposal.md` para a motivação e os specs em `specs/` para o comportamento esperado.

## Goals / Non-Goals

**Goals:**
- Um contrato genérico na base, sem detalhes de input nativo, evento de texto ou critério de valor vazio.
- Modelo entra só por `writeValue`; escrita do usuário sai por um único commit.
- Estado desabilitado com uma fonte única: o `FormControl`.
- Checkbox e radio com valor de opção separado do modelo, e estado marcado derivado do modelo.

**Non-Goals:**
- Modelo em array para grupo de checkboxes (fica para um change próprio).
- Mudanças no `FormText` além da adaptação aos novos hooks: lógica do botão de mostrar senha e máscara na escrita programática ficam para outro change.
- Mudanças de comportamento no `form-error-toast`.

## Decisions

**1. `NgControl` obrigatório.** `inject(NgControl, { self: true })` sem `optional`. Quem esquecer o vínculo recebe erro na criação, em vez de um controle silenciosamente inoperante. Alternativa descartada: manter o modo standalone, que exige ramos em `clear()`, no `disabled` e no `value`.

**2. `writeValue` só atualiza o estado.** Passa a gravar apenas `_value`. Nenhuma chamada a `onChange`. O único caminho de escrita para o modelo é o commit da ação do usuário. Alternativa descartada: continuar usando o setter de `value`, que causa o eco e o `dirty` indevido.

**3. Commit único na base.** A base expõe um método protegido `commitValue(value)` que grava `_value` e chama `onChange(value)` uma vez. Cada subclasse lê o próprio evento e chama o commit. Isso remove o `emitChange` genérico que assumia `event.target.value`.

**4. Hooks específicos por subclasse.**
- `focusTarget(): HTMLElement | null`, com default `null`. `clear()` chama o hook para devolver o foco. Cada subclasse declara o próprio `@ViewChild`.
- `isEmpty(value: T | null): boolean`, com default simples. `hasValue` passa a usar esse hook.

**5. Estado desabilitado do control.** O `@Input() disabled` e o setter saem. Mantém-se o signal `_disabled` apenas como espelho do `control.disabled`, atualizado em `statusUpdate`. `isActive` lê esse espelho. Assim existe uma única fonte (o control), sem sincronização de mão dupla.

**6. Sincronização desde a primeira renderização.** A subscrição em `control.events` e o `statusUpdate` inicial passam de `ngOnInit` para `ngAfterContentInit`. A razão: o `FormControlName` define o `control` no próprio `ngOnChanges`, e ele pode rodar depois do `ngOnInit` do componente, deixando o `control` indefinido. Esta decisão depende de verificação (ver Risks).

**7. `id` com `guid-typescript`.** `Guid.create().toString()` como valor padrão do signal `_id`. Alternativa descartada: `crypto.randomUUID()`, que não existe em contexto não seguro. Outra alternativa, um contador estático, também resolveria, mas a escolha do projeto é o pacote.

**8. Checkbox com `optionValue`.** O input continua se chamando `value` no template (`@Input('value') optionValue`), então a demo e outros usos não mudam. A base não tem mais `value` como input, então não há colisão. `FormCheckBase` deixa de sobrescrever o setter e o getter de `value`.

**9. `checked` derivado do modelo.** `checked` é um `computed` sobre o valor do modelo: `modelo !== null && modelo === optionValue`. Remove-se `_checked` e o `[checked]` input. O `writeValue` do checkbox apenas atualiza `_value`. Ao desmarcar, o checkbox faz commit de `null`. Isso também corrige o desalinhamento do radio, porque cada radio lê o modelo e o `FormControl` notifica todos os radios registrados.

**10. Tipagem genérica.** `FormCheckBase<T = string>` substitui `FormElementBase<any>`.

**11. Normalização na escrita sem eco.** Como `writeValue` não chama mais `onChange`, a normalização do modelo (por exemplo, `'' → null`, `null → []`, remoção de `<p>` no editor) passa a ser feita por um hook protegido `normalizeValue(value: T | null): T | null`, aplicado em `writeValue` antes de gravar `_value`. O `commitValue` aplica o mesmo hook antes de chamar `onChange`. Assim a escrita programática e a do usuário seguem a mesma regra, sem depender do eco. Alternativa descartada: deixar cada subclasse normalizar no próprio `writeValue`, o que duplicaria a regra. Esta decisão estende a 2 e não contradiz nenhum requisito.

## Risks / Trade-offs

- **[Timing do `ngAfterContentInit` não confirmado]** → Teste de integração com `formControl` e `formControlName` que verifica o estado inicial inválido e touched. Se o hook ainda não tiver o `control`, a alternativa é observar `ngControl` com um `effect`/`afterNextRender`, a ser decidida no apply com evidência.
- **[Remoção do eco pode mudar componentes que dependiam dele]** → Por exemplo, o `FormDatepicker` pode normalizar o modelo dentro de `writeValue` por meio de `onChange`. Antes de remover, inspecionar cada `writeValue` dos controles e garantir que a normalização continue acontecendo (por exemplo, `'' → null`), agora no commit ou na própria leitura.
  - Inspeção (tarefa 1.3): dependem do eco para normalizar na escrita:
    - `form-datepicker`: `writeValue` converte texto vazio em `null` (`this.value = text || null`) e, no modo `range`, chama `normalizeRangeOrder()` e `emitRangeValue()`, que escreve no modelo. O `writeValue` não deve emitir para o modelo; só normalizar o que é exibido.
    - `form-editor`: o setter de `value` aplica a transformação de `paragraph` (remove `<p>`). Sem o setter, a escrita programática não passaria por ela.
    - `form-select-multiple`: o setter de `value` converte `null`/`undefined` em `[]` e ignora escritas iguais.
    - `form-select`: `selectionChange` (ação do ng-select) passa a usar `commitValue`; a escrita por `writeValue` não precisa de normalização extra.
    - `form-text` e `form-textarea`: sem normalização na escrita; só o `emitChange` muda.
- **[Consumidores com `[value]` ou `[disabled]` sem `formControl`]** → Busca no projeto antes do apply. A busca feita agora cobriu os templates de `shared/ui` e o botão `[disabled]` do `user-form-search`, sem usos em componentes de formulário fora da demo. Só vi parte da `showcase-form-page.html`.
- **[Checkbox sem `[value]`]** → Fica sem opção definida e nunca marcado a partir do modelo. Não há aviso em dev nesta rodada.
- **[Datepicker com `isActive`]** → A spec de `form-datepicker` muda o requisito de `disabled`. Os demais cenários continuam válidos.

## Migration Plan

Mudança única, sem feature flag, porque os consumidores são internos ao projeto. A ordem sugerida no apply: base e hooks primeiro, depois `FormCheckBase`, depois cada controle concreto, depois a demo e a migração para `guid-typescript`. Rollback: reverter o commit do change.

## Open Questions

- Lógica do botão de mostrar senha e máscara na escrita programática do `FormText`: fica para um change próprio. Não bloqueia este.
