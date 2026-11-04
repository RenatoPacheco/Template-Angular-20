# Spec Delta

## Purpose

Define o contrato comum dos controles de formulário de `shared/ui` que funcionam sempre ligados a um `FormControl`: estado derivado do control, escrita sem efeitos colaterais, identificação, limpeza e saídas de erro e ajuda.

## ADDED Requirements

### Requirement: Uso obrigatório com FormControl

Os controles de formulário DEVEM ser usados sempre com `formControl` ou `formControlName`. Um controle usado sem vínculo a um `FormControl` DEVE falhar na criação, em vez de funcionar em modo standalone. Não existe input `value` nem `disabled` para definir o modelo ou o estado desabilitado.

#### Scenario: Controle sem FormControl

- **WHEN** um controle de formulário é renderizado sem `formControl` nem `formControlName`
- **THEN** a criação do componente falha com erro, e nenhum valor é exibido

#### Scenario: Atributo disabled não é input

- **WHEN** um consumidor usa `[disabled]="true"` em um controle de formulário com `formControl`
- **THEN** o controle não fica desabilitado por esse atributo; o estado desabilitado vem somente de `control.disable()`

### Requirement: Estado derivado do FormControl desde a primeira renderização

O controle DEVE refletir `disabled`, `valid`/`invalid`, `pristine` e `touched` do `FormControl`, inclusive na primeira renderização e após qualquer mudança feita pelo código do consumidor no control.

#### Scenario: Estado inválido na primeira renderização

- **WHEN** o controle é criado com um `FormControl` que já está inválido e `touched`
- **THEN** o controle exibe o estado inválido sem depender de nenhuma interação do usuário

#### Scenario: Desabilitar pelo control

- **WHEN** o código chama `control.disable()` depois da renderização
- **THEN** o controle passa a exibir o estado desabilitado e deixa de aceitar digitação

### Requirement: Escrita programática sem efeitos colaterais

Quando o modelo é alterado pelo código (`setValue`, `patchValue`, `reset`), o controle DEVE apenas exibir o novo valor. Essa escrita NÃO DEVE marcar o `FormControl` como `dirty` nem emitir um novo valor para o modelo.

#### Scenario: setValue não marca dirty

- **WHEN** o consumidor chama `control.setValue('abc')` em um controle que estava `pristine`
- **THEN** o controle exibe `abc` e o `FormControl` continua `pristine`

#### Scenario: reset restaura estado limpo

- **WHEN** o consumidor chama `control.reset()` depois de o usuário alterar o valor
- **THEN** o controle exibe o valor resetado e o `FormControl` está `pristine` e `untouched`

### Requirement: Escrita do usuário atualiza o modelo uma vez

Uma ação do usuário que altera o valor DEVE atualizar o `FormControl` uma única vez com o novo valor e marcá-lo como `dirty`. Sair do campo DEVE marcá-lo como `touched`.

#### Scenario: Digitação atualiza o modelo

- **WHEN** o usuário digita `abc` em um campo de texto com `formControl`
- **THEN** o valor do `FormControl` é `abc`, ele fica `dirty`, e o valor é emitido uma única vez

#### Scenario: Saída do campo marca touched

- **WHEN** o usuário sai de um campo sem alterar o valor
- **THEN** o `FormControl` fica `touched` e continua `pristine`

### Requirement: Identificação do controle

O controle DEVE ter um `id` único quando o consumidor não informa um. O valor DEVE ser gerado sem depender de APIs restritas a contexto seguro, de modo que o controle renderize também em HTTP sobre IP de rede. Um `id` informado pelo consumidor DEVE ser usado no lugar do gerado.

#### Scenario: Renderização fora de contexto seguro

- **WHEN** o controle é renderizado em uma página servida por HTTP sem contexto seguro
- **THEN** o controle renderiza normalmente e recebe um `id` único

#### Scenario: id informado pelo consumidor

- **WHEN** o consumidor define `id="cpf"`
- **THEN** o campo e o `label` usam `cpf` como identificador

### Requirement: Limpeza do valor

A ação de limpar DEVE redefinir o `FormControl` para `null`, marcá-lo como `pristine` e `untouched`, e devolver o foco ao campo.

#### Scenario: Limpar campo preenchido

- **WHEN** o usuário aciona a ação de limpar em um campo com valor e ativo
- **THEN** o valor do control vira `null`, o control fica `pristine` e `untouched`, e o foco volta ao campo

### Requirement: Saídas de erro e ajuda

O controle DEVE emitir as saídas `error` e `helper` quando o usuário aciona o ícone correspondente, conforme a capacidade `form-error-toast` para erros.

#### Scenario: Erro emitido ao acionar o alerta

- **WHEN** o control é inválido e o usuário aciona o ícone de alerta
- **THEN** a saída `error` é emitida com as mensagens dos erros do control
