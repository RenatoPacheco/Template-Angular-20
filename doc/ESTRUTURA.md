# Estrutura do Projeto

## Objetivo

Esta estrutura tem como objetivo organizar a aplicação por responsabilidade, facilitando:

* Escalabilidade
* Reutilização
* Manutenção
* Testabilidade
* Separação de domínio e infraestrutura
* Desenvolvimento orientado a features

---

# Princípios

## 1. Core não conhece Features

O diretório `core` contém apenas infraestrutura global da aplicação.

Exemplos:

* Autenticação
* HTTP
* Interceptors
* Guards globais
* Notificações
* Tema
* Storage
* Configurações

O `core` nunca deve depender de uma feature específica.

✅ Correto

```txt
core/auth/auth.service.ts
core/http/api.service.ts
core/theme/theme.service.ts
```

❌ Incorreto

```txt
core/curso.service.ts
core/aluno.service.ts
```

---

## 2. Shared não contém regra de negócio

O diretório `shared` é destinado exclusivamente a reutilização técnica ou visual.

Exemplos:

* Componentes visuais
* Pipes
* Diretivas
* Validators
* Utilitários
* Tipagens genéricas

✅ Correto

```txt
shared/ui/button
shared/pipes/cpf.pipe
shared/utils/date.utils.ts
```

❌ Incorreto

```txt
shared/services/curso.service.ts
shared/components/aluno-card
```

Se o componente conhece o domínio, ele pertence à feature.

---

## 3. Features representam o domínio

Tudo que representa regra de negócio deve ficar dentro de `features`.

Exemplos:

```txt
features/cursos
features/alunos
features/professores
features/turmas
```

Cada feature deve ser isolada das demais sempre que possível.

---

# Estrutura da Aplicação

## Core

Responsável pela infraestrutura global.

```txt
core/
```

### Auth

Responsável por autenticação e autorização.

```txt
core/auth/
```

Exemplos:

* Login
* Logout
* Refresh Token
* Guards
* Interceptors de autenticação

---

### Notification

Responsável pela exibição de mensagens.

```txt
core/notification/
```

Exemplos:

* Toast
* Alertas
* Mensagens globais

---

### Theme

Responsável pelo gerenciamento visual.

```txt
core/theme/
```

Exemplos:

* Tema claro
* Tema escuro
* Preferências visuais

---

### Platform

Responsável por abstrações da plataforma.

```txt
core/platform/
```

Exemplos:

* Browser detection
* Mobile detection
* Recursos específicos do ambiente

---

### Recaptcha

Integrações com Google reCAPTCHA.

```txt
core/recaptcha/
```

---

### Scroll

Manipulação global de rolagem.

```txt
core/scroll/
```

---

### Storage

Abstração de armazenamento local.

```txt
core/storage/
```

Exemplos:

* LocalStorage
* SessionStorage

---

### Http

Infraestrutura de comunicação.

```txt
core/http/
```

Exemplos:

* ApiService
* Interceptors
* Tratamento global de erros

---

# Shared

Responsável por reutilização.

```txt
shared/
```

---

## UI

Componentes visuais reutilizáveis.

```txt
shared/ui/
```

Exemplos:

```txt
button/
modal/
card/
table/
loading/
empty-state/
```

Esses componentes não devem conhecer regras de negócio.

---

## Directives

Diretivas reutilizáveis.

```txt
shared/directives/
```

Exemplos:

```txt
autofocus.directive.ts
permission.directive.ts
debounce-click.directive.ts
```

---

## Pipes

Transformações reutilizáveis.

```txt
shared/pipes/
```

Exemplos:

```txt
cpf.pipe.ts
telefone.pipe.ts
truncate.pipe.ts
```

---

## Validators

Validadores reutilizáveis.

```txt
shared/validators/
```

Exemplos:

```txt
cpf.validator.ts
cnpj.validator.ts
password.validator.ts
```

---

## Utils

Funções puras sem dependência do Angular.

```txt
shared/utils/
```

Exemplos:

```txt
date.utils.ts
string.utils.ts
array.utils.ts
```

Regra:

Se pode ser uma função pura, deve ser util.

---

## Types

Tipagens reutilizáveis.

```txt
shared/types/
```

Exemplos:

```txt
pagination.type.ts
api-response.type.ts
```

---

# Layout

Responsável pela estrutura visual da aplicação.

```txt
layout/
```

---

## Shell

Container principal da aplicação.

```txt
layout/shell/
```

Responsável por:

* Header
* Sidebar
* Footer
* Área de conteúdo

---

## Auth Layout

Layout utilizado em páginas autenticadas.

```txt
layout/auth-layout/
```

---

## Public Layout

Layout utilizado em páginas públicas.

```txt
layout/public-layout/
```

---

## Components

Componentes estruturais do layout.

```txt
layout/components/
```

Exemplos:

```txt
header/
sidebar/
footer/
navbar/
breadcrumb/
mobile-menu/
```

---

# Features

Representam o domínio da aplicação.

```txt
features/
```

Cada feature deve possuir autonomia.

---

## Estrutura de uma Feature

Exemplo:

```txt
features/cursos/
```

---

### Pages

Representam páginas associadas às rotas.

```txt
pages/
```

Exemplos:

```txt
curso-list-page/
curso-form-page/
curso-details-page/
curso-search-page/
```

Responsabilidades:

* Orquestrar componentes
* Consumir serviços
* Controlar fluxo da tela

Não devem conter componentes reutilizáveis.

---

### UI

Componentes exclusivos da feature.

```txt
ui/
```

Exemplos:

```txt
curso-form/
curso-table/
curso-card/
curso-modal/
```

Esses componentes podem conhecer o domínio.

---

### Data Access

Camada de acesso a dados.

```txt
data-access/
```

Exemplos:

```txt
curso.service.ts
curso.repository.ts
curso.api.service.ts
curso.store.ts
```

Responsabilidades:

* Comunicação com API
* Gerenciamento de estado
* Persistência
* Mapeamentos

---

### Models

Modelos da feature.

```txt
models/
```

Exemplos:

```txt
curso.model.ts
curso-request.model.ts
curso-response.model.ts
```

---

### Types

Tipos específicos da feature.

```txt
types/
```

---

### Utils

Utilitários específicos da feature.

```txt
utils/
```

---

### Guards

Guards específicos da feature.

```txt
guards/
```

---

### Routes

Configuração de rotas da feature.

```txt
cursos.routes.ts
```

---

# Fluxo de Dependências

A dependência deve seguir a seguinte direção:

```txt
Features
    ↓
Shared
    ↓
Core
```

Regras:

✅ Feature pode usar Shared

✅ Feature pode usar Core

✅ Shared pode usar Core

❌ Core não usa Feature

❌ Shared não usa Feature

❌ Feature não deve acessar internamente outra Feature

---

# Convenções

## Componentes

```txt
curso-form.component.ts
curso-form.component.html
curso-form.component.scss
```

---

## Services

```txt
curso.service.ts
auth.service.ts
notification.service.ts
```

---

## Models

```txt
curso.model.ts
usuario.model.ts
```

---

## Validators

```txt
cpf.validator.ts
cnpj.validator.ts
password.validator.ts
```

---

## Utils

```txt
date.utils.ts
string.utils.ts
```

---

# Resumo

## Core

Infraestrutura global.

## Shared

Reutilização técnica e visual.

## Layout

Estrutura visual da aplicação.

## Features

Domínio e regras de negócio.

Toda regra de negócio deve nascer dentro de uma feature.

Toda infraestrutura deve ficar no core.

Tudo que for reutilizável e genérico deve ficar no shared.

## Modelo de organização por responsabilidade, não por tipo.

```txt
src/
└── app/
    │
    ├── core/                          # Infraestrutura global da aplicação
    │   │
    │   ├── auth/
    │   │   ├── auth.service.ts
    │   │   ├── auth.guard.ts
    │   │   ├── auth.interceptor.ts
    │   │   ├── auth.model.ts
    │   │   └── auth.constants.ts
    │   │
    │   ├── notification/
    │   │   ├── notification.service.ts
    │   │   ├── notification.model.ts
    │   │   └── notification.types.ts
    │   │
    │   ├── theme/
    │   │   ├── theme.service.ts
    │   │   ├── theme.model.ts
    │   │   └── theme.constants.ts
    │   │
    │   ├── platform/
    │   │   ├── platform.service.ts
    │   │   └── platform.types.ts
    │   │
    │   ├── recaptcha/
    │   │   ├── recaptcha.service.ts
    │   │   └── recaptcha.config.ts
    │   │
    │   ├── scroll/
    │   │   ├── scroll.service.ts
    │   │   └── scroll.utils.ts
    │   │
    │   ├── storage/
    │   │   ├── local-storage.service.ts
    │   │   └── session-storage.service.ts
    │   │
    │   ├── http/
    │   │   ├── api.service.ts
    │   │   ├── http-error.interceptor.ts
    │   │   └── loading.interceptor.ts
    │   │
    │   ├── guards/
    │   ├── interceptors/
    │   ├── configs/
    │   ├── constants/
    │   └── tokens/
    │
    │
    ├── shared/                        # Reutilização visual/técnica
    │   │
    │   ├── ui/
    │   │   │
    │   │   ├── button/
    │   │   │   ├── button.component.ts
    │   │   │   ├── button.component.html
    │   │   │   └── button.component.scss
    │   │   │
    │   │   ├── modal/
    │   │   ├── card/
    │   │   ├── table/
    │   │   ├── form-field/
    │   │   ├── loading/
    │   │   ├── empty-state/
    │   │   └── confirm-dialog/
    │   │
    │   ├── directives/
    │   │   ├── autofocus.directive.ts
    │   │   ├── permission.directive.ts
    │   │   └── debounce-click.directive.ts
    │   │
    │   ├── pipes/
    │   │   ├── cpf.pipe.ts
    │   │   ├── telefone.pipe.ts
    │   │   └── truncate.pipe.ts
    │   │
    │   ├── validators/
    │   │   ├── cpf.validator.ts
    │   │   └── password.validator.ts
    │   │
    │   ├── utils/
    │   │   ├── date.utils.ts
    │   │   ├── string.utils.ts
    │   │   └── array.utils.ts
    │   │
    │   └── types/
    │       ├── api-response.type.ts
    │       └── pagination.type.ts
    │
    │
    ├── layout/                        # Estrutura visual da aplicação
    │   │
    │   ├── shell/
    │   │   ├── shell.component.ts
    │   │   ├── shell.component.html
    │   │   ├── shell.component.scss
    │   │   └── shell.store.ts
    │   │
    │   ├── auth-layout/
    │   │   ├── auth-layout.component.ts
    │   │   └── auth-layout.component.html
    │   │
    │   ├── public-layout/
    │   │   ├── public-layout.component.ts
    │   │   └── public-layout.component.html
    │   │
    │   └── components/
    │       │
    │       ├── header/
    │       │   ├── header.component.ts
    │       │   ├── header.component.html
    │       │   └── header.component.scss
    │       │
    │       ├── sidebar/
    │       │   ├── sidebar.component.ts
    │       │   ├── sidebar.component.html
    │       │   └── sidebar.component.scss
    │       │
    │       ├── footer/
    │       ├── navbar/
    │       ├── breadcrumb/
    │       └── mobile-menu/
    │
    │
    ├── features/                      # Domínio de negócio
    │   │
    │   ├── cursos/
    │   │   │
    │   │   ├── pages/                # Páginas ligadas às rotas
    │   │   │   │
    │   │   │   ├── curso-list-page/
    │   │   │   │   ├── curso-list-page.component.ts
    │   │   │   │   ├── curso-list-page.component.html
    │   │   │   │   └── curso-list-page.component.scss
    │   │   │   │
    │   │   │   ├── curso-form-page/
    │   │   │   │   ├── curso-form-page.component.ts
    │   │   │   │   ├── curso-form-page.component.html
    │   │   │   │   └── curso-form-page.component.scss
    │   │   │   │
    │   │   │   ├── curso-details-page/
    │   │   │   └── curso-search-page/
    │   │   │
    │   │   ├── ui/                   # Componentes reutilizáveis da feature
    │   │   │   │
    │   │   │   ├── curso-form/
    │   │   │   │   ├── curso-form.component.ts
    │   │   │   │   ├── curso-form.component.html
    │   │   │   │   └── curso-form.component.scss
    │   │   │   │
    │   │   │   ├── curso-table/
    │   │   │   ├── curso-card/
    │   │   │   ├── curso-filters/
    │   │   │   └── curso-modal/
    │   │   │
    │   │   ├── data-access/          # API, state, repositories
    │   │   │   ├── curso.service.ts
    │   │   │   ├── curso.store.ts
    │   │   │   ├── curso.repository.ts
    │   │   │   └── curso-api.service.ts
    │   │   │
    │   │   ├── models/
    │   │   │   ├── curso.model.ts
    │   │   │   ├── curso-request.model.ts
    │   │   │   └── curso-response.model.ts
    │   │   │
    │   │   ├── types/
    │   │   ├── utils/
    │   │   ├── guards/
    │   │   └── cursos.routes.ts
    │   │
    │   │
    │   ├── disciplinas/
    │   │   │
    │   │   ├── pages/
    │   │   ├── ui/
    │   │   ├── data-access/
    │   │   ├── models/
    │   │   └── disciplinas.routes.ts
    │   │
    │   │
    │   ├── series/
    │   │   ├── pages/
    │   │   ├── ui/
    │   │   ├── data-access/
    │   │   ├── models/
    │   │   └── series.routes.ts
    │   │
    │   │
    │   ├── alunos/
    │   ├── professores/
    │   ├── turmas/
    │   └── dashboard/
    │
    │
    ├── app.routes.ts
    ├── app.config.ts
    ├── app.component.ts
    ├── app.component.html
    └── app.component.scss
```

