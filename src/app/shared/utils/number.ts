/**
 * Incrementa um número em 1.
 * @param value Número a ser incrementado (pode ser `null`/`undefined`)
 * @returns O número incrementado; quando `value` for `null`/`undefined` retorna `1`
 */
export function incrementNumber(value: number|null|undefined): number {
    if (value === null || value === undefined) {
        return 1;
    }
    return value + 1;
}

/**
 * Decrementa um número em 1, com opção de limitar o valor mínimo.
 * @param value Número a ser decrementado (pode ser `null`/`undefined`)
 * @param config Objeto opcional com `minimum` para limitar o menor valor permitido
 * @returns O número decrementado; quando `value` for `null`/`undefined` retorna `0`. Se `minimum` for informado, o resultado não ficará abaixo dele.
 */
export function decrementNumber(
    value: number|null|undefined, config?: {
    minimum?: number
}): number {
    if (value === null || value === undefined) {
        return 0;
    }
    const newValue = value - 1;
    if (config?.minimum !== undefined 
        && newValue < config.minimum) {
        return config.minimum;
    }
    return newValue;
}
