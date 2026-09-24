import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const MONTHS_FULL = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

const MONTHS_SHORT = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

// Semana ISO 8601 usada pelo calendário padrão: 1=segunda ... 7=domingo.
const WEEKDAYS_SHORT = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];
const WEEKDAYS_LONG = [
  'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira',
  'sexta-feira', 'sábado', 'domingo',
];
const WEEKDAYS_NARROW = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

/**
 * Tradução pt-BR do calendário do ng-bootstrap, provida no escopo do
 * `FormDatepicker` para não afetar outros datepickers da aplicação.
 */
@Injectable()
export class PtBrDatepickerI18n extends NgbDatepickerI18n {
  public override getWeekdayLabel(weekday: number, width: 'short' | 'long' | 'narrow' = 'short'): string {
    const index = weekday - 1;

    if (index < 0 || index > 6) {
      return '';
    }

    switch (width) {
      case 'long':
        return WEEKDAYS_LONG[index];
      case 'narrow':
        return WEEKDAYS_NARROW[index];
      default:
        return WEEKDAYS_SHORT[index];
    }
  }

  public override getMonthShortName(month: number): string {
    return MONTHS_SHORT[month - 1] ?? '';
  }

  public override getMonthFullName(month: number): string {
    return MONTHS_FULL[month - 1] ?? '';
  }

  public override getMonthLabel(date: NgbDateStruct): string {
    const month = this.getMonthFullName(date.month);
    return month ? `${month} de ${date.year}` : `${date.year}`;
  }

  public override getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day} de ${this.getMonthFullName(date.month)} de ${date.year}`;
  }
}
