import { InputBoolean, InputNumber } from "./types.utils";

/**
 * Converte um valor para `number`.
 * Aceita `number` ou `string` que represente um número.
 * @param value Valor a ser convertido (number | string)
 * @returns O número convertido; retorna `0` quando a conversão falhar, `undefined` quando o valor for `undefined`
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

/**
 * Converte um valor para `Date`.
 * @param value Valor a ser convertido (Date | string | null | undefined)
 * @returns A data convertida; retorna `null` quando a conversão falhar, `undefined` quando o valor for `undefined`
 */
export function transformDate(value: string|Date|null|undefined): Date|null|undefined {
  if (!value) {
    return value === undefined ? undefined : null;
  }
  return typeof value === 'string' ? new Date(value) : value;
}
