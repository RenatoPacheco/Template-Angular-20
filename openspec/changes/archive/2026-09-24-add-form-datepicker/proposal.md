# Proposal

## Why

O `shared/ui` hoje só oferece entrada de data via `app-form-text` com `transform="date"` (`src/app/shared/ui/form-text/form-text.ts:164`), que apenas mascara a digitação (`dd/mm/yyyy`) sem nenhum calendário. Usuários precisam adivinhar datas válidas e não há suporte a seleção visual nem a intervalo.

A dependência `@ng-bootstrap/ng-bootstrap@^19.0.1` já está declarada em `package.json:31` e em uso (modal, toast, dropdown), mas o datepicker nunca foi aproveitado. O custo da dependência já foi pago e o benefício do calendário nunca foi colhido.

## What Changes

- Criar o componente `FormDatepicker` em `src/app/shared/ui/form-datepicker/` (`form-datepicker.ts`, `form-datepicker.html`, `form-datepicker.scss`), espelhando a estrutura do `form-text`:
  - `@Component` standalone, `selector: 'app-form-datepicker'`, `templateUrl`, `styleUrl`, `imports`, `host: { '[class]': 'hostClass()' }` com `form-group mb-3`.
  - Herda de `FormElementBase`, integra com `app-label`, saídas `error`/`helper`, e respeita `disabled`/`readonly`/`loading`/`size`/`id`/`class`/`label`/`enabled-error`/`enabled-helper`.
- Integrar o calendário do ng-bootstrap (`NgbInputDatepicker`) ao campo:
  - Digitação manual com a máscara `dd/MM/yyyy` existente (`DateTransform`) **mais** botão que abre o calendário popup (decisão confirmada com o solicitante: "digita + picker").
  - Botão de limpar próprio do projeto (padrão `form-text.html` / `form-select.html`), sem usar o `clearable` interno de terceiros.
- Suportar data única **e** intervalo (decisão confirmada: "única + intervalo") via input de modo (`single` | `range`):
  - Modo `single`: valor do controle é `string | null` em `dd/MM/yyyy`.
  - Modo `range`: valor do controle é `{ start: string | null; end: string | null }`, ambos em `dd/MM/yyyy`.
- Expor valores como `string` em `dd/MM/yyyy` (decisão confirmada), mantendo compatibilidade com `DateTransform`, `DatePipe` e `CustomValidators.date()` (padrão `dd/MM/yyyy`).
- Localizar o calendário para pt-BR (nomes de meses/dias em português, primeiro dia da semana segunda-feira, `dd/mm/yyyy` como placeholder padrão).
- Exportar o componente pelo barrel `src/app/shared/ui/index.ts`.
- Demonstrar os dois modos na página existente `showcase-form-page`, sem rota nova.

## Capabilities

### New Capabilities

- `form-datepicker`: controle de data com calendário ng-bootstrap, modos data única e intervalo, valor em `string dd/MM/yyyy`, seguindo o contrato dos controles de `shared/ui` (`FormElementBase`, `app-label`, erros/helper, estados).

### Modified Capabilities

- Nenhuma. O `FormText` com `transform="date"` **não** será alterado nem removido; o novo componente convive com ele.

## Impact

- Novo componente público exportado pelo barrel `src/app/shared/ui/index.ts`.
- Nova dependência de template em `NgbDatepickerModule` (já instalado, sem nova entrada em `package.json`); provedor de `NgbDatepickerI18n` pt-BR (escopo do componente ou global — a definir em `design.md`).
- Sem breaking changes: nenhum componente existente é modificado.
- `showcase-form-page.ts` / `.html` ganham dois controles de demonstração (data única + intervalo).
- Estilos: SCSS local para posicionar os botões de calendário/limpar sobre o campo (padrão `form-text.scss` / `form-select.scss`); sem tema global novo — o datepicker do ng-bootstrap usa o Bootstrap 5 já presente.
