# Design

## Context

Ver `proposal.md` (Why) para a motivação. Estado atual relevante:

- `FormText` (`src/app/shared/ui/form-text/form-text.ts`) é o modelo estrutural: standalone, `extends FormElementBase<string>`, signals + getters/setters, `hostClass` (`form-group mb-3`), `elementClass` (`form-control-{size}`), `label[app-label]`, botões de ação em `div.form-element`, `DateTransform.apply(input)` no `emitChange` para máscara `dd/MM/yyyy` (via `DatePipe.apply`).
- `FormSelect` (`src/app/shared/ui/form-select/`) é o precedente de integração com biblioteca de terceiros: importa o módulo standalone da lib (`NgSelectModule`), usa `ngModel` standalone interno + handler próprio (`selectionChange`), limpeza pelo botão próprio (`clearable: false` na lib), `ViewChild` separado para `focus()` porque `#element` de `FormElementBase` espera elemento nativo.
- `button-dropdown.ts` mostra o padrão de import do ng-bootstrap: diretivas standalone (`NgbDropdown`, …) no array `imports`, sem módulo global.
- Validação de data já existe: `dateValidator('dd/MM/yyyy')` (`src/app/shared/validators/date.validator.ts`) com regex + checagem de data real (`31/02` inválido); máscara com `DatePipe.apply`.
- ng-bootstrap `^19.0.1` já instalado; datepicker nunca usado. O datepicker trabalha nativamente com `NgbDateStruct` (`{ year, month, day }`), **não** com `string` — é preciso uma ponte para o contrato `string dd/MM/yyyy` exigido na spec.
- Specs em `specs/form-datepicker/spec.md` (data única `string | null`, intervalo `{ start, end }`, digita + picker, pt-BR, limites opcionais).

## Goals / Non-Goals

**Goals:**

- Um componente `FormDatepicker` com a mesma cara e contrato dos demais controles (`FormElementBase`, `app-label`, erros/helper, `size`, botões de ação).
- Ponte `string dd/MM/yyyy` ↔ `NgbDateStruct` sem vazar `NgbDateStruct` para os consumidores.
- Modo `range` reutilizando a lógica do modo `single` por ponta.
- pt-BR contido no componente, sem efeito colateral global.

**Non-Goals:**

- Seletor de hora / `dateTime` / `timeSpan` (continuam no `FormText`).
- Validadores próprios no componente (a validação continua no `FormGroup` do consumidor, ex. `CustomValidators.date()`).
- Tema global novo (o popup do datepicker usa o Bootstrap 5 já presente, como hoje no dropdown).
- Testes automatizados (projeto com `skipTests: true`, sem suíte para `shared/ui` — verificado no change anterior).

## Decisions

### 1. Um componente com `mode`, valor `string | DateRange | null`

`export class FormDatepicker extends FormElementBase<string | DateRange>` com `mode: 'single' | 'range'` (padrão `single`) e `export interface DateRange { start: string | null; end: string | null }` colocada no próprio `form-datepicker.ts` (mesmo padrão de `SelectItem` em `form-select.ts`).

- Alternativa considerada: dois componentes (`FormDate` + `FormDateRange`). Rejeitada: duplicaria template, SCSS, i18n e sincronia; o modo só alterna quantidade de campos e shape do valor.
- `writeValue` normaliza: `null`/`undefined`/`''` → `null` (single) ou `{ start: null, end: null }` (range); troca de `mode` com valor incompatível zera o controle em vez de reinterpretar.

### 2. Ponte com o datepicker via `DatepickerField`, sem `ngModel` no `input`

Cada campo (`single`, `start`, `end`) é uma instância de `DatepickerField` (`form-datepicker-field.ts`), classe que encapsula o texto (`signal<string>`), o struct interno (`signal<NgbDateStruct | null>`), a máscara viva (`DateTransform`), a adoção de datas válidas e os limites vigentes (recebidos como funções, incluindo a restrição cruzada do intervalo). O componente orquestra as instâncias: emite o valor (`string` crua ou `{ start, end }`), normaliza a ordem do intervalo e gerencia foco/limpeza. Os helpers puros (`parseDateString` / `formatDateStruct`) seguem no diretório do componente.

- `parse` reaproveita a semântica do `dateValidator('dd/MM/yyyy')` (regex + data real) para decidir o avanço dos structs internos; o VALOR exposto é sempre o texto cru do campo (vazio é `null`), mesmo inválido — assim `CustomValidators.date()` e os limites por validador enxergam o que foi digitado em vez de um `null` silencioso.
- `format` produz `dd/MM/yyyy` com zero à esquerda.
- O `input[ngbDatepicker]` recebe `[startDate]` do struct interno (o popup abre no mês da última data válida digitada), `[minDate]`/`[maxDate]`, e `(dateSelect)` formata para `string`; `(input)` aplica `DateTransform.apply` (máscara viva, igual ao `form-text`) e adota o struct quando o texto mascarado fecha uma data válida (cobre também colagem, que não dispara novo `input` após a máscara).
- Um `NgbDateParserFormatter` customizado em `dd/MM/yyyy` (`DateStringParserFormatter`, provido no escopo do componente) faz o processamento interno de texto da diretiva concordar com a máscara e com o valor em `string` — sem ele, a diretiva reformataria o texto para ISO no `blur`. Nomes de API verificados na versão instalada (`NgbDatepickerModule`, `NgbDatepickerI18n`, `NgbDateStruct`, `NgbInputDatepicker` com `[minDate]`/`[maxDate]`/`(dateSelect)`/`toggle()`, `NgbDate` com `from`/`before`/`after`).
- O popup usa `container="body"`: por padrão ele é inserido logo após o `input`, dentro do `.form-group.ng-invalid`, e a regra global de `_forms.scss` pintaria de vermelho os selects de mês/ano do calendário. No `body` a regra não alcança o popup (bônus: não é cortado por ancestrais com `overflow`).

Alternativa considerada: prover `NgbDateAdapter<string>` + `NgbDateParserFormatter` customizados e ligar o modelo da diretiva direto na `string`. Rejeitada: o adapter teria de lidar com o union `string | DateRange`, e a máscara viva (`DateTransform`, que escreve no `input` nativo) disputaria o texto com a diretiva — o sync manual por ponta é mais explícito e testável.

### 3. Range como dois campos, cada um com seu popup

Modo `range` renderiza dois `input[ngbDatepicker]` (início/fim), cada um com máscara e botões próprios de calendário e limpar; limpar uma ponta preserva a outra e devolve o foco ao mesmo campo. Restrição cruzada via `[minDate]`/`[maxDate]` (o `minDate` do fim = início e o `maxDate` do início = fim, quando definidos) somados aos inputs `min-date`/`max-date` (em `dd/MM/yyyy`, convertidos para struct). Se o usuário informar fim < início (digitado ou selecionado), as pontas são normalizadas por troca, garantindo `start <= end`.

- Alternativa considerada: popup único com `dayTemplate` customizado e highlight de intervalo (receita oficial do ng-bootstrap). Rejeitada: exige template de dia, estado de hover e CSS próprios, com mais superfície de bug sob `provideZonelessChangeDetection()`; dois campos reaproveitam 1:1 a lógica single e casam com "digita + picker" por ponta.

### 4. pt-BR com provedores no escopo do componente

`providers: [{ provide: NgbDatepickerI18n, useClass: PtBrDatepickerI18n }]` no próprio `@Component`, com `PtBrDatepickerI18n` e o parser em arquivos colocados em `form-datepicker/` (`form-datepicker-i18n.ts`, `form-datepicker-parser.ts`). Mês/dia em português, semana começando segunda-feira, placeholder padrão `dd/mm/yyyy`.

- Alternativa considerada: provedor global em `app.config.ts`. Rejeitada: mudaria qualquer datepicker futuro da aplicação; escopo local tem zero efeito colateral (o `FormText` com `transform="date"` segue intacto).

### 5. Estrutura e estilos espelhando `form-text`

`form-datepicker.ts` / `.html` / `.scss`, `selector: 'app-form-datepicker'`, `imports: [Label, Button, NgbDatepickerModule]`, `hostClass` (`form-group mb-3`), `elementClass` (`form-control-{size}`), `div.form-element` com classes `action-calendar`/`action-clear` e `@if (isActive())` para os botões `app-button` (`fa-calendar`, `fa-times`), `<ng-content>` ao final. O SCSS estende o padrão de `form-text.scss` (dois botões → `padding-right: 5rem` e deslocamento do primeiro botão). `#element` continua sendo o `input` do modo single / início do intervalo para `focus()`/`clear()` herdados; o campo em uso é rastreado por `(focus)` por ponta (`single`/`start`/`end`) e o `clear()` devolve o foco a ele (padrão: início), via `@ViewChild('endElement')` adicional. Exportação no barrel `shared/ui/index.ts` e demonstração dos dois modos no `showcase-form-page` (controles `dataPicker` e `periodo`, este com `Validators.required` no grupo para exercitar o erro).

## Risks / Trade-offs

- [Risco] `DateTransform.apply` (escrita direta no `input`) vs. diretiva `ngbDatepicker` (que também observa `input`/`blur`) podem disputar texto ou cursor → Mitigação: máscara só reescreve no formato que o parser entende; tasks incluem verificação manual de digitação caractere a caractere e de cursor no meio do texto.
- [Risco] Popup do ng-bootstrap sob `provideZonelessChangeDetection()` pode não atualizar (sintoma já mapeado no change do ng-select) → Mitigação: validar na página showcase; se falhar, `markForCheck()` pontual no handler de `dateSelect` e registro do motivo aqui.
- [Risco] Loop de sincronia struct ↔ string (select atualiza texto que re-dispara parse) → Mitigação: guards de igualdade em todos os setters/computed, no padrão dos setters existentes (`if (value !== ...)`).
- [Trade-off] Sem highlight visual de intervalo dentro de um único calendário (cada ponta tem seu popup) → aceito: restrição cruzada por `min/maxDate` comunica o vínculo; highlight unificado ficaria para evolução futura sem quebrar a spec.
- [Trade-off] Orçamento de build: o bundle inicial já estoura os 500kB (baseline documentada no change anterior); o módulo do datepicker adiciona incremento pequeno de JS já dentro do ng-bootstrap existente.

## Migration Plan

Mudança puramente aditiva: nenhum arquivo existente é alterado em comportamento (só acréscimos: diretório `form-datepicker/`, linha no barrel, demo no showcase). Rollback = reverter esses acréscimos. Sem migração de dados ou flags.

## Open Questions

Nenhuma. As três decisões de produto (valor `string dd/MM/yyyy`, única + intervalo, digita + picker) foram confirmadas com o solicitante antes da proposta; os pontos restantes são detalhes de implementação cobertos pelas tasks de verificação.
