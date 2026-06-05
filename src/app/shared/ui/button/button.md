# Componente Button

## Visão geral
O componente `Button` centraliza tema, texto, ícone e título para botões padronizados da aplicação.

- Arquivo: [src/app/shared/ui/button/button.ts](src/app/shared/ui/button/button.ts)
- Template: [src/app/shared/ui/button/button.html](src/app/shared/ui/button/button.html)
- Seletor: `button [app-button]`
- Base visual: Bootstrap 5 + Font Awesome 4

Isso significa que o atributo `app-button` deve ser usado em um elemento `button`.

Exemplo mínimo:

```html
<button app-button theme="save"></button>
```

## Como funciona
O componente calcula automaticamente:

- classe CSS final (`classComputed`): tema + tamanho + classe extra
- ícone (`iconComputed`): pelo `theme` ou spinner quando `loading=true`
- texto (`textComputed`): `text` manual ou texto padrão por ação
- título (`titleComputed`): `title` manual ou título automático

Se você projetar conteúdo dentro do botão (ng-content), o fallback automático de ícone/texto não é renderizado.

Exemplo com conteúdo projetado:

```html
<button app-button theme="danger">
	<i class="fa fa-bomb"></i>
	Remover tudo
</button>
```

## Inputs

### `theme`
- Tipo: `InputVariant | ButtonAction`
- Default: `''` (mapeado para `btn btn-outline-primary`)
- Função: define classe visual, texto padrão e ícone padrão

Valores de variante (`InputVariant`):
- `''`, `error`, `primary`, `secondary`, `success`, `warning`, `info`, `danger`, `light`, `dark`

Valores de ação (`ButtonAction`):
- `edit`, `delete`, `view`, `save`, `cancel`, `submit`, `reset`
- `download`, `upload`, `search`, `filter`, `sort`, `refresh`
- `add`, `remove`, `approve`, `reject`, `archive`, `unarchive`
- `enable`, `disable`, `lock`, `unlock`

### `size`
- Tipo: `'sm' | 'md' | 'lg'`
- Default: `'md'`
- Mapeamento Bootstrap:
	- `sm` -> `btn-sm`
	- `md` -> classe vazia (tamanho padrão)
	- `lg` -> `btn-lg`

### `text`
- Tipo: `string`
- Default: `''`
- Função: sobrescreve o texto padrão da ação

### `title`
- Tipo: `string`
- Default: `''`
- Função: sobrescreve o título automático do botão

### `disabled`
- Tipo: `boolean` (com transform `transformBoolean`)
- Entrada flexível no HTML: `true`, `false`, `'true'`, `'false'`, `''`
- Default: `false`

### `loading`
- Tipo: `boolean` (com transform `transformBoolean`)
- Default: `false`
- Efeito: troca ícone por `fa fa-spinner fa-spin`

### `class`
- Tipo atual no componente: `boolean` com transform `transformBoolean`
- Comportamento esperado para classe extra: `string`
- Observação: a implementação atual concatena `class` como se fosse string no `classComputed`.

## Mapeamentos internos

### Textos padrão (`texts`)
Exemplos:
- `save` -> `Salvar`
- `delete` -> `Excluir`
- `approve` -> `Aprovar`

### Ícones padrão (`icons`)
Exemplos:
- `save` -> `fa fa-save`
- `delete` -> `fa fa-trash`
- `lock` -> `fa fa-lock`

### Temas (`themes`)
Exemplos:
- `primary` -> `btn btn-outline-primary`
- `error` -> `btn btn-outline-danger`
- `save` -> `btn btn-outline-success`
- `delete` -> `btn btn-outline-danger`

## Exemplos de uso

### 1) Ação padrão por tema

```html
<button app-button theme="save"></button>
```

Resultado esperado:
- classe: `btn btn-outline-success`
- ícone: `fa fa-save`
- texto: `Salvar`
- title: `clique para salvar`

### 2) Sobrescrevendo texto e título

```html
<button
	app-button
	theme="delete"
	text="Apagar item"
	title="Clique para apagar este registro">
</button>
```

### 3) Estado de carregamento

```html
<button app-button theme="submit" [loading]="true"></button>
```

Resultado esperado:
- ícone: `fa fa-spinner fa-spin`

### 4) Tamanhos

```html
<button app-button theme="primary" size="sm"></button>
<button app-button theme="primary" size="md"></button>
<button app-button theme="primary" size="lg"></button>
```

### 5) Estado desabilitado

```html
<button app-button theme="approve" disabled></button>
```

## Dependências
- Bootstrap 5 para classes `btn`, `btn-outline-*`, `btn-sm`, `btn-lg`
- Font Awesome 4 para classes `fa fa-*`
- Utilitário de transform em [src/app/shared/utils/transforms.ts](src/app/shared/utils/transforms.ts)

## Checklist rápido
- Usou `button` com atributo `app-button`
- Definiu `theme` com valor válido
- Validou contraste visual do tema escolhido
- Testou `disabled` e `loading`
- Se usou conteúdo interno no botão, confirmou que fallback automático não é necessário
