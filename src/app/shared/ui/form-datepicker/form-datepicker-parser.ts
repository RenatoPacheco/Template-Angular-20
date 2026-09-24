import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const DATE_PATTERN = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

/**
 * Converte um texto em `dd/MM/yyyy` para `NgbDateStruct`.
 * Usa a mesma semântica do `dateValidator('dd/MM/yyyy')`:
 * regex de formato + checagem de data real (`31/02/2026` é inválido).
 * Textos vazios, incompletos ou inválidos resultam em `null`.
 */
export function parseDateString(text: string | null | undefined): NgbDateStruct | null {
  const value = (text ?? '').trim();

  if (!value) {
    return null;
  }

  const match = value.match(DATE_PATTERN);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const date = new Date(year, month - 1, day);
  const valid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  if (!valid) {
    return null;
  }

  return { year, month, day };
}

/**
 * Converte um `NgbDateStruct` para texto em `dd/MM/yyyy` (com zero à esquerda).
 * Structs nulos ou incompletos resultam em `null`.
 */
export function formatDateStruct(date: NgbDateStruct | null | undefined): string | null {
  if (!date || !date.day || !date.month || !date.year) {
    return null;
  }

  return `${pad(date.day)}/${pad(date.month)}/${date.year}`;
}

/**
 * Compara dois `NgbDateStruct`: negativo se `a < b`, zero se iguais,
 * positivo se `a > b`. Usado na normalização do intervalo e nos limites.
 */
export function compareDateStructs(a: NgbDateStruct, b: NgbDateStruct): number {
  if (a.year !== b.year) {
    return a.year - b.year;
  }

  if (a.month !== b.month) {
    return a.month - b.month;
  }

  return a.day - b.day;
}

/**
 * Verifica se um struct está dentro dos limites opcionais (inclusive).
 */
export function isStructWithinLimits(
  date: NgbDateStruct,
  min: NgbDateStruct | null,
  max: NgbDateStruct | null,
): boolean {
  if (min && compareDateStructs(date, min) < 0) {
    return false;
  }

  if (max && compareDateStructs(date, max) > 0) {
    return false;
  }

  return true;
}

/**
 * `NgbDateParserFormatter` em `dd/MM/yyyy`, provido no escopo do
 * `FormDatepicker` para que o processamento interno de texto da diretiva
 * `ngbDatepicker` concorde com a máscara (`DateTransform`) e com o valor
 * em `string` exposto ao formulário.
 */
@Injectable()
export class DateStringParserFormatter extends NgbDateParserFormatter {
  public override parse(value: string): NgbDateStruct | null {
    return parseDateString(value);
  }

  public override format(date: NgbDateStruct | null): string {
    return formatDateStruct(date) ?? '';
  }
}
