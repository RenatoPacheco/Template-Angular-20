# Tasks — `add-form-datepicker`

## 1. Helpers de conversão e i18n pt-BR

- [x] 1.1 Criar `src/app/shared/ui/form-datepicker/form-datepicker-parser.ts` com `parseDateString(text): NgbDateStruct | null` (mesma semântica do `dateValidator('dd/MM/yyyy')` — regex + data real, `31/02/2026` → `null`) e `formatDateStruct(date): string | null` (`dd/MM/yyyy` com zero à esquerda), e verificar com `ng build` que o arquivo compila sem erro de tipos.
- [x] 1.2 Criar `src/app/shared/ui/form-datepicker/form-datepicker-i18n.ts` com `PtBrDatepickerI18n extends NgbDatepickerI18n` (meses/dias em português, semana começando segunda-feira) e verificar na página showcase (após 2.2) que o popup abre com cabeçalhos em pt-BR.
- [x] 1.3 Confirmar na API instalada (`node_modules/@ng-bootstrap/ng-bootstrap`) os nomes de import (`NgbDatepickerModule`, `NgbDatepickerI18n`, `NgbDateStruct`, `NgbInputDatepicker`) e o suporte a `[minDate]`/`[maxDate]`/`(dateSelect)`/`toggle()`, ajustando o `design.md` se algum nome divergir, e verificar que `design.md` reflete os nomes reais.

## 2. Componente `FormDatepicker` — modo data única

- [x] 2.1 Criar `form-datepicker.ts` com `@Component` standalone, `selector: 'app-form-datepicker'`, `templateUrl`, `styleUrl`, `imports: [Label, FormsModule, Button, NgbDatepickerModule]`, `providers` com o i18n pt-BR, `host: { '[class]': 'hostClass()' }` e `export class FormDatepicker extends FormElementBase<string | DateRange>`, seguindo `form-text.ts:26-36`, e verificar com `ng build` que o componente compila isolado.
- [x] 2.2 Declarar `export interface DateRange { start: string | null; end: string | null }` no próprio `form-datepicker.ts` e os inputs `mode` (`'single' | 'range'`, padrão `'single'`), `placeholder` (padrão `dd/mm/yyyy`), `min-date`/`max-date` (strings `dd/MM/yyyy`, alias com hífen como `control-secret` em `form-text.ts:83`), todos com guards de igualdade nos setters, e verificar via showcase que os placeholders e o modo padrão renderizam corretamente.
- [x] 2.3 Implementar a sincronia single: signals internos `NgbDateStruct | null`, `writeValue` normalizando `null`/`undefined`/`''` para `null`, `(dateSelect)` formatando para `string` e fechando o popup, `(input)` aplicando `DateTransform.apply` e atualizando o struct quando o texto fechar data válida, texto inválido preservado com valor `null`, e verificar digitando `15/03/2026`, `31/02/2026` e `''` que o valor do `FormControl` é `15/03/2026`, `null` e `null` respectivamente.
- [x] 2.4 Criar `form-datepicker.html` (modo single) com `label[app-label]` nos mesmos bindings de `form-text.html:1-9`, `div.form-element` com `input #element ngbDatepicker` (`ngModel` standalone + `(dateSelect)` + `(input)` + `(blur)` → `emitBlur()` + `[disabled]="disabled || readonly || loading"`), botões `app-button` de calendário (`fa-calendar`, `toggle()`) e limpar (`fa-times`, `clear()`) sob `@if (isActive())`, e `<ng-content>` ao final, e verificar que o template passa no modo estrito (`ng build` sem erro de template).
- [x] 2.5 Criar `form-datepicker.scss` estendendo o padrão de `form-text.scss:1-44` para dois botões (`action-calendar` + `action-clear`: `padding-right: 5rem`, deslocamento do botão de calendário), e verificar visualmente que o texto não passa por baixo dos botões e o foco usa o anel `--bs-primary`.

## 3. Modo intervalo (`range`)

- [x] 3.1 Estender o template com o segundo campo (início/fim) no modo `range`, cada `input` com seu `ngbDatepicker`, máscara e botão de calendário próprios e um único botão de limpar no bloco, e verificar com `ng build` que ambos os ramos do template compilam no modo estrito.
- [x] 3.2 Implementar o valor `DateRange`: `writeValue` aceitando `{ start, end }` e normalizando `null`/`undefined` para `{ start: null, end: null }`, troca de `mode` com valor incompatível zerando o controle, seleção/digitação por ponta atualizando só a ponta correspondente, normalização por troca quando fim < início, `clear()` voltando a `{ start: null, end: null }` com `pristine`/`untouched` e foco no campo de início, e verificar cada cenário da spec de intervalo na página showcase.
- [x] 3.3 Implementar os limites: converter `min-date`/`max-date` para struct, combinar com a restrição cruzada (`minDate` do fim = início, `maxDate` do início = fim) nos bindings `[minDate]`/`[maxDate]` de cada popup, digitação fora do limite resultando em ponta `null`, e verificar com `min-date="01/01/2026"` que `31/12/2025` aparece desabilitado no calendário e resulta em valor `null`.

## 4. Exportação e demonstração

- [x] 4.1 Adicionar `export * from './form-datepicker/form-datepicker';` em `src/app/shared/ui/index.ts` e verificar com `ng build` que o barrel resolve o import.
- [x] 4.2 Em `showcase-form-page.ts`, importar `FormDatepicker` de `@app/shared/ui` (array `imports`) e adicionar os controles `dataPicker: control<string | null>(null, { validators: [CustomValidators.date()] })` e `periodo: control<DateRange | null>(null)`, e verificar que o formulário compila com os novos controles.
- [x] 4.3 Em `showcase-form-page.html`, adicionar `<app-form-datepicker formControlName="dataPicker" label="Datepicker" />` e `<app-form-datepicker formControlName="periodo" mode="range" label="Período" />` ao lado dos demais campos, e verificar que ambos renderizam na rota `/showcase/form`.

## 5. Verificação

- [x] 5.1 Rodar `ng build` e confirmar que não há erro de template estrito; registrar o delta do bundle inicial em `tasks.md` (o orçamento de 500kB já estava estourado antes — baseline 686.43 kB após o change anterior — anotar o novo valor e confirmar que o incremento é só o módulo do datepicker).
      > Build OK, zero erros de template/tipos (após corrigir: getters de texto sem `()` no template e helper `asDateInput` para `startDate`/`minDate`/`maxDate`, que o ng-bootstrap tipa como não-nuláveis). Bundle inicial: **733.38 kB** (baseline 686.43 kB → **+46.95 kB**; orçamento estourado em 233.38 kB, antes 186.43 kB). O incremento é o submódulo do datepicker (`NgbDatepicker`/`NgbCalendar`/navegação) referenciado pela primeira vez — o ng-bootstrap já estava no bundle, mas só a metade modal/toast/dropdown.
- [x] 5.2 Validar manualmente em `/showcase/form` todos os cenários da spec: seleção pelo calendário, digitação válida/inválida com máscara viva e cursor no meio do texto, abrir/fechar (botão, Escape, clique fora, teclado), limpar, limites, pt-BR, `disabled`/`readonly`/`loading`, `size` e exibição de erro com `required`, e anotar desvios em `tasks.md`.
- [x] 5.3 Confirmar que o popup e a digitação funcionam sob `provideZonelessChangeDetection()`; se for necessário `markForCheck()` pontual no handler de `dateSelect`, aplicar e registrar o motivo no `design.md` (risco já mapeado).

## 6. Revisão pós-implementação — passthrough de texto inválido

- [x] 6.1 Expor o texto cru digitado no valor (vazio é `null`) em vez de `null`, nos modos single e range; structs internos continuam avançando só em datas válidas; swap só com ambas válidas; spec, design e código atualizados e `ng build` sem erros.
- [x] 6.2 Devolver o foco ao mesmo campo no `clear()` (rastreio por `(focus)` + `@ViewChild('endElement')`); spec, design e código atualizados e `ng build` sem erros.
- [x] 6.3 Corrigir foco no `clear()` do modo single: o `@ViewChild('element', { static: true })` da base não resolve dentro de `@if/@else` (retorna `undefined`); queries dinâmicas próprias (`fieldElement`/`endElement` com `static: false`) + foco explícito; `ng build` sem erros.
- [x] 6.4 Botão de limpar independente por ponta no modo range (`clearStart()`/`clearEnd()` preservando a outra ponta + foco no mesmo campo); spec, design, template, componente e SCSS atualizados e `ng build` sem erros.
- [x] 6.5 Popup com `container="body"` para a borda de erro não vazar aos selects de mês/ano (regra global de `_forms.scss`); spec, design e template atualizados e `ng build` sem erros.
- [x] 6.6 Extrair classe `DatepickerField` (texto, struct, máscara, adoção, limites por campo) com 3 instâncias no componente (anotações de tipo quebram inferência circular); template, barrel, design e `ng build` sem erros.
