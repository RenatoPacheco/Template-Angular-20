import { formatDate } from '@angular/common';

export class LocationUtils {
    /**
     * Retorna uma descrição legível do período decorrido desde a data informada até agora.
     * Exemplos: "2 anos e 3 meses", "ontem", "hoje".
     * @param value Data de referência (string ou formato aceito por `Date`)
     * @returns Texto representando o período decorrido ou `null` se a data for inválida
     */
    static periodoDecorrido(value: string): string | null {
      const fromDate = new Date(value);
      const toDate = new Date();

      if (isNaN(fromDate.getTime())) return null;

      let years = toDate.getFullYear() - fromDate.getFullYear();
      let months = toDate.getMonth() - fromDate.getMonth();
      let days = toDate.getDate() - fromDate.getDate();

      // Corrige se o dia atual for menor que o dia da data original
      if (days < 0) {
        months--;
        const previousMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
        days += previousMonth.getDate();
      }

      // Corrige se o mês atual for menor que o mês da data original
      if (months < 0) {
        years--;
        months += 12;
      }

      const parts: string[] = [];

      if (years > 0) {
        parts.push(`${years} ano${years > 1 ? 's' : ''}`);
      }

      if (months > 0) {
        parts.push(`${months} ${months > 1 ? 'meses' : 'mês'}`);
      }

      if (days > 0) {
        if (days == 1) {
          parts.push('ontem');
        } else {
          parts.push(`${days} dia${days > 1 ? 's' : ''}`);
        }
      }

      if (parts.length === 0) {
        parts.push('hoje');
      }

      // Junta as partes com "e" no último
      if (parts.length === 1) {
        return parts[0];
      } else if (parts.length === 2) {
        return `${parts[0]} e ${parts[1]}`;
      } else {
        return `${parts[0]}, ${parts[1]} e ${parts[2]}`;
      }
    }

    /**
     * Formata uma data para `dd/MM/YYYY HH:mm:ss`.
     * @param value Data (string ou Date) a ser formatada
     * @param valueDefault Valor padrão retornado em caso de erro na conversão
     * @returns String formatada ou `valueDefault` quando a conversão falhar
     */
    static toDateTime(value: string, _default: string|null = null): string|null {
      let result = _default;
      try {
        result = formatDate(value, 'dd/MM/yyyy HH:mm:ss', 'en-US') || _default;
      } catch {
        result = _default;
      }
      return result;
    }

    /**
     * Formata uma data para `dd/MM/YYYY`.
     * @param value Data (string ou Date) a ser formatada
     * @param valueDefault Valor padrão retornado em caso de erro na conversão
     * @returns String formatada ou `valueDefault` quando a conversão falhar
     */
    static toDate(value: string, _default: string|null = null): string|null {
      let result = _default;
      try {
        result = formatDate(value, 'dd/MM/yyyy', 'en-US') || _default;
      } catch {
        result = _default;
      }
      return result;
    }

    /**
     * Formata uma data para `HH:mm:ss`.
     * @param value Data (string ou Date) a ser formatada
     * @param valueDefault Valor padrão retornado em caso de erro na conversão
     * @returns String formatada ou `valueDefault` quando a conversão falhar
     */
    static toTime(value: string, _default: string|null = null): string|null {
      let result = _default;
      try {
        result = formatDate(value, 'HH:mm:ss', 'en-US') || _default;
      } catch {
        result = _default;
      }
      return result;
    }
  }
