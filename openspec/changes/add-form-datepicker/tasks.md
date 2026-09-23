# Tasks — `add-form-datepicker`

## 1. Helpers de conversão e i18n pt-BR

- [ ] 1.1 Criar `src/app/shared/ui/form-datepicker/form-datepicker-parser.ts` com `parseDateString(text): NgbDateStruct | null` (mesma semântica do `dateValidator('dd/MM/yyyy')` — regex + data real, `31/02/2026` → `null`) e `formatDateStruct(date): string | null` (`dd/MM/yyyy` com zero à esquerda), e verificar com `ng build` que o arquivo compila sem erro de tipos.
- [ ] 1.2 Criar `src/app/shared/ui/form-datepicker/form-datepicker-i18n.ts` com `PtBrDatepickerI18n extends NgbDatepickerI18n` (meses/dias em português, semana começando segunda-feira) e verificar na página showcase (após 2.2) que o popup abre com cabeçalhos em pt-BR.
- [ ] 1.3 Confirmar na API instalada (`node_modules/@ng-bootstrap/ng-bootstrap`) os nomes de import (`NgbDatepickerModule`, `NgbDatepickerI18n`, `NgbDateStruct`, `NgbInputDatepicker`) e o suporte a `[minDate]`/`[maxDate]`/`(dateSelect)`/`toggle()`, ajustando o `design.md` se algum nome divergir, e verificar que `design.md` reflete os nomes reais.

## 2. Componente `FormDatepicker` — modo data única

- [ ] 2.1 Criar `form-datepicker.ts` com `@Component` standalone, `selector: 'app-form-datepicker'`, `templateUrl`, `styleUrl`, `imports: [Label, FormsModule, Button, NgbDatepickerModule]`, `providers` com o i18n pt-BR, `host: { '[class]': 'hostClass()' }` e `export class FormDatepicker extends FormElementBase<string | DateRange>`, seguindo `form-text.ts:26-36`, e verificar com `ng build` que o componente compila isolado.
- [ ] 2.2 Declarar `export interface DateRange { start: string | null; end: string | null }` no próprio `form-datepicker.ts` e os inputs `mode` (`'single' | 'range'`, padrão `'single'`), `placeholder` (padrão `dd/mm/yyyy`), `min-date`/`max-date` (strings `dd/MM/yyyy`, alias com hífen como `control-secret` em `form-text.ts:83`), todos com guards de igualdade nos setters, e verificar via showcase que os placeholders e o modo padrão renderizam corretamente.
- [ ] 2.3 Implementar a sincronia single: signals internos `NgbDateStruct | null`, `writeValue` normalizando `null`/`undefined`/`''` para `null`, `(dateSelect)` formatando para `string` e fechando o popup, `(input)` aplicando `DateTransform.apply` e atualizando o struct quando o texto fechar data válida, texto inválido preservado com valor `null`, e verificar digitando `15/03/2026`, `31/02/2026` e `''` que o valor do `FormControl` é `15/03/2026`, `null` e `null` respectivamente.
- [ ] 2.4 Criar `form-datepicker.html` (modo single) com `label[app-label]` nos mesmos bindings de `form-text.html:1-9`, `div.form-element` com `input #element ngbDatepicker` (`ngModel` standalone + `(dateSelect)` + `(input)` + `(blur)` → `emitBlur()` + `[disabled]="disabled || readonly || loading"`), botões `app-button` de calendário (`fa-calendar`, `toggle()`) e limpar (`fa-times`, `clear()`) sob `@if (isActive())`, e `<ng-content>` ao final, e verificar que o template passa no modo estrito (`ng build` sem erro de template).
- [ ] 2.5 Criar `form-datepicker.scss` estendendo o padrão de `form-text.scss:1-44` para dois botões (`action-calendar` + `action-clear`: `padding-right: 5rem`, deslocamento do botão de calendário), e verificar visualmente que o texto não passa por baixo dos botões e o foco usa o anel `--bs-primary`.

## 3. Modo intervalo (`range`)

- [ ] 3.1 Estender o template com o segundo campo (início/fim) no modo `range`, cada `input` com seu `ngbDatepicker`, máscara e botão de calendário próprios e um único botão de limpar no bloco, e verificar com `ng build` que ambos os ramos do template compilam no modo estrito.
- [ ] 3.2 Implementar o valor `DateRange`: `writeValue` aceitando `{ start, end }` e normalizando `null`/`undefined` para `{ start: null, end: null }`, troca de `mode` com valor incompatível zerando o controle, seleção/digitação por ponta atualizando só a ponta correspondente, normalização por troca quando fim < início, `clear()` voltando a `{ start: null, end: null }` com `pristine`/`untouched` e foco no campo de início, e verificar cada cenário da spec de intervalo na página showcase.
- [ ] 3.3 Implementar os limites: converter `min-date`/`max-date` para struct, combinar com a restrição cruzada (`minDate` do fim = início, `maxDate` do início = fim) nos bindings `[minDate]`/`[maxDate]` de cada popup, digitação fora do limite resultando em ponta `null`, e verificar com `min-date="01/01/2026"` que `31/12/2025` aparece desabilitado no calendário e resulta em valor `null`.

## 4. Exportação e demonstração

- [ ] 4.1 Adicionar `export * from './form-datepicker/form-datepicker';` em `src/app/shared/ui/index.ts` e verificar com `ng build` que o barrel resolve o import.
- [ ] 4.2 Em `showcase-form-page.ts`, importar `FormDatepicker` de `@app/shared/ui` (array `imports`) e adicionar os controles `dataPicker: control<string | null>(null, { validators: [CustomValidators.date()] })` e `periodo: control<DateRange | null>(null)`, e verificar que o formulário compila com os novos controles.
- [ ] 4.3 Em `showcase-form-page.html`, adicionar `<app-form-datepicker formControlName="dataPicker" label="Datepicker" />` e `<app-form-datepicker formControlName="periodo" mode="range" label="Período" />` ao lado dos demais campos, e verificar que ambos renderizam na rota `/showcase/form`.

## 5. Verificação

- [ ] 5.1 Rodar `ng build` e confirmar que não há erro de template estrito; registrar o delta do bundle inicial em `tasks.md` (o orçamento de 500kB já estava estourado antes — baseline 686.43 kB após o change anterior — anotar o novo valor e confirmar que o incremento é só o módulo do datepicker).
- [ ] 5.2 Validar manualmente em `/showcase/form` todos os cenários da spec: seleção pelo calendário, digitação válida/inválida com máscara viva e cursor no meio do texto, abrir/fechar (botão, Escape, clique fora, teclado), limpar, limites, pt-BR, `disabled`/`readonly`/`loading`, `size` e exibição de erro com `required`, e anotar desvios em `tasks.md`.
- [ ] 5.3 Confirmar que o popup e a digitação funcionam sob `provideZonelessChangeDetection()`; se for necessário `markForCheck()` pontual no handler de `dateSelect`, aplicar e registrar o motivo no `design.md` (risco já mapeado).
