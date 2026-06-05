import { InputBoolean, InputNumber } from "./types";

/**
 * Converte um valor para `number`.
 * Aceita `number` ou `string` que represente um número.
 * @param value Valor a ser convertido (number | string)
 * @returns O número convertido; retorna `0` quando a conversão falhar
 */
export function transformNumber(value: InputNumber): number {
 return typeof value !== 'number' ? isNaN(Number(value)) ? 0 : Number(value) : value;
}

/**
 * Converte um valor para `boolean`.
 * Aceita `boolean` ou strings como 'true'/'false'/'', ignorando maiúsculas/minúsculas.
 * @param value Valor a ser convertido (boolean | 'true' | 'false' | '')
 * @returns `true` quando o valor representar verdadeiro, caso contrário `false`
 */
export function transformBoolean(value: InputBoolean): boolean {
 return typeof value !== 'boolean' ? `${value}` == '' || (/true/i).test(`${value}`) : value;
}
