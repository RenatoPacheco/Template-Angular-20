# OPENSPEC.md

Guia de instalação, configuração e uso do **OpenSpec** — fluxo de trabalho de especificação orientada a mudanças ("change-driven") para agentes de IA.

---

## O que é o OpenSpec

O OpenSpec organiza o trabalho em **changes** (mudanças). Cada change descreve o *que* deve ser feito (proposal), *como* o sistema deve se comportar (specs), *como* implementar (design) e quais passos tomar (tasks).

O repositório usa o **schema `spec-driven`**. Os artefatos gerados são:

| Artefato | Arquivo | Descrição |
|----------|---------|-----------|
| Proposal | `openspec/changes/<nome>/proposal.md` | O que e por quê |
| Spec | `openspec/changes/<nome>/specs/<capability>/spec.md` | Delta de comportamento exigido |
| Design | `openspec/changes/<nome>/design.md` | Como implementar |
| Tasks | `openspec/changes/<nome>/tasks.md` | Passos de implementação |

Estrutura criada na raiz do projeto:

```
openspec/
├── changes/    # changes ativas (e archive/)
├── specs/      # specs "main" (capabilities) após o sync
└── config.yaml # contexto do projeto e regras por artefato
```

---

## Instalação

O OpenSpec é distribuído como pacote npm. Você pode invocá-lo direto com `npx` (sem instalar globalmente):

```bash
npx @fission-ai/openspec@latest <comando>
```

Ou instalar globalmente:

```bash
npm install -g @fission-ai/openspec
```

> O utilitário de terminal chama-se `openspec`; o pacote npm é `@fission-ai/openspec`. O comando do prompt `openspec init` roda como pacote `@fission-ai/openspec`.

---

## Configuração

Quando `openspec/` não existir no projeto, inicialize:

```bash
# Interativo (com prompts)
npx @fission-ai/openspec@latest init

# Não-interativo, já configurando para um agente específico
npx @fission-ai/openspec@latest init --tools opencode
```

O `init` cria a estrutura `openspec/` e, com `--tools opencode`, instala skills e comandos em `.opencode/`.

### config.yaml

O contexto e regras do projeto ficam em `openspec/config.yaml`:

```yaml
schema: spec-driven

# Contexto do projeto (mostrado à IA ao gerar artefatos)
context: |
  Tech stack: Angular 20, TypeScript, SCSS
  Convenções: Conventional Commits, Gitflow

# Regras por artefato (opcional)
rules:
  proposal:
    - Manter o proposal conciso
    - Sempre incluir uma seção "Non-goals"
```

---

## Uso pelo terminal

### Workflow principal (no OpenCode)

Com os comandos instalados em `.opencode/`, o fluxo é:

```
/opsx-propose <ideia>   # 1. Planejar: cria change + artifacts (proposal, specs, design, tasks)
/opsx-apply <nome>      # 2. Implementar: executa os tasks (código)
/opsx-update <nome>     # (opcional) Revisar/editar artifactos de um change existente
/opsx-sync <nome>       # 3. Sincronizar delta specs para as specs "main"
/opsx-archive <nome>    # 4. Arquivar change concluída
/opsx-explore <ideia>   # Modo exploração: pensar/discutir sem implementar
```

### Alternativa sem agentes (somente CLI)

Você também pode usar o CLI diretamente para criar e consultar changes:

```bash
# Criar um change novo (scaffold de artifacts)
openspec new change "nome-do-change"

# Ver status/order de criação dos artifacts
openspec status --change "nome-do-change" --json

# Ver instruções para criar um artifact
openspec instructions <artifact-id> --change "nome-do-change" --json

# Listar changes ativas
openspec list

# Ver artifactos de um change
openspec show "nome-do-change"

# Validar estrutura/specs
openspec validate --change "nome-do-change"

# Arquivar change (cria delta specs para as main specs)
openspec archive "nome-do-change"

# Contexto do projeto (raiz do openspec)
openspec context --json
```

### Comandos úteis adicionais

| Comando | Descrição |
|---------|-----------|
| `openspec init` | Inicializar estrutura no projeto |
| `openspec context --json` | Mostra a raiz do OpenSpec e contexto configurado |
| `openspec list --json` | Lista changes ativas em JSON |
| `openspec schemas --json` | Lista workflows/schemas disponíveis |
| `openspec doctor` | Diagnostica a instalação/config |
| `openspec config profile` | Adiciona mais workflows (new, continue, ff, bulk-archive, verify, onboard) |

---

## Modelo mental

1. **Planeje** (`/opsx-propose`): gera os artifacts de planejamento. Nada de código é alterado nesta fase.
2. **Implemente** (`/opsx-apply`): executa os tasks. Só aqui o código muda.
3. **Sincronize** (`/opsx-sync`): aplica os deltas de spec nas specs principais.
4. **Arquive** (`/opsx-archive`): move o change para `openspec/changes/archive/`.

---

## Referências

- Site: https://openspec.dev
- Documentação: https://github.com/Fission-AI/OpenSpec
- CLI no npm: https://www.npmjs.com/package/@fission-ai/openspec