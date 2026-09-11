# OPENCODE.md

Guia de instalação, configuração e uso do **OpenCode** — agente de código aberto para IA.

---

## Instalação

### Script de instalação (recomendado)

```bash
curl -fsSL https://opencode.ai/install | bash
```

### Via gerenciadores de pacotes

```bash
# npm
npm install -g opencode-ai

# bun
bun install -g opencode-ai

# pnpm
pnpm install -g opencode-ai

# Yarn
yarn global add opencode-ai

# Homebrew (macOS/Linux) — tap oficial, mais atualizado
brew install anomalyco/tap/opencode

# Arch Linux
sudo pacman -S opencode
paru -S opencode-bin
```

### Windows

```bash
# Chocolatey
choco install opencode

# Scoop
scoop install opencode

# npm
npm install -g opencode-ai

# Mise
mise use -g github:anomalyco/opencode
```

> **Recomendação no Windows**: usar WSL para melhor desempenho e compatibilidade.

### Desktop (GUI)

- macOS: `brew install --cask opencode-desktop` ou baixe em https://opencode.ai/download
- Windows: https://opencode.ai/download
- Linux: https://opencode.ai/download

---

## Configuração

### Provider de modelos

Execute o comando `/connect` no TUI, selecione um provider e insira sua API key:

```
/connect
```

Providers disponíveis incluem OpenCode Zen, Claude, GPT, Gemini e 75+ provedores via Models.dev.

**OpenCode Zen** (recomendado para iniciantes): modelos testados e validados pelo time do OpenCode. Acesse https://opencode.ai/zen para detalhes.

### Arquivo de configuração

Crie `opencode.json` na raiz do projeto para configurções específicas do repositório:

```json
{
  "$schema": "https://opencode.ai/schema.json"
}
```

Documentação completa: https://opencode.ai/docs/config

---

## Inicialização

```bash
cd /caminho/do/projeto
opencode
```

Inicialize o projeto no OpenCode:

```
/init
```

Isso analisa o projeto e cria um `AGENTS.md` na raiz. **Commite esse arquivo ao Git** para ajudar o OpenCode a entender o projeto.

---

## Uso

### Perguntar sobre o código

Use `@` para buscar arquivos:

```
Como a autenticação é tratada em @src/app/core/http/auth.interceptor.ts?
```

### Planejar e construir features

1. Mude para **Plan mode** com **Tab** (no canto inferior direito):
   ```
   <TAB>
   ```
2. Descreva o que deseja:
   ```
   Preciso de uma tela de configurações do usuário com formulário de perfil.
   ```
3. Revise o plano, dê feedback se necessário.
4. Volte para **Build mode** com **Tab** e peça para implementar:
   ```
   Parece bom! Implemente as mudanças.
   ```

### Fazer alterações diretamente

```
Adicione validação no formulário de login usando o padrão que já existe em @src/app/feature/user/
```

### Desfazer / Refazer

```
/undo    # desfaz a última alteração
/redo    # refaz a alteração desfeita
```

### Compartilhar sessão

```
/share   # cria link da conversa atual
```

---

## Atalhos úteis

| Comando | Descrição |
|---------|-----------|
| `/connect` | Configurar provider de IA |
| `/init` | Inicializar projeto |
| `/undo` | Desfazer última alteração |
| `/redo` | Refazer alteração desfeita |
| `/share` | Compartilhar conversa |
| `Tab` | Alternar entre Plan/Build mode |
| `@` | Buscar arquivos no projeto |

---

## Referências

- Site: https://opencode.ai
- Documentação: https://opencode.ai/docs
- GitHub: https://github.com/anomalyco/opencode
- Discord: https://opencode.ai/discord
