import { HttpUrlEncodingCodec } from '@angular/common/http';

const codec = new HttpUrlEncodingCodec();

export class StringUtils {

  /**
   * Formata uma mensagem substituindo os placeholders pelos valores correspondentes.
   * Ex.: format('Olá {0} {1}', 'João', 'Silva') => 'Olá João Silva'
   * @param mensage Mensagem contendo placeholders no formato `{0}`, `{1}`, ...
   * @param args Valores que substituirão os placeholders, na ordem
   * @returns A mensagem com os valores aplicados
   */
  static format(mensage: string, ...args: any[]): string {
    if (mensage) {
      args.forEach((value, index) => {
        mensage = mensage.replace(`{${index}}`, value);
      });
    }
    return mensage;
  }

  /**
   * Formata um nome completo colocando a primeira letra de cada palavra em maiúsculo,
   * exceto preposições comuns como "de", "da", "do", "dos", "das" e "e" (quando não for a primeira palavra).
   * @param nomeCompleto Nome completo a ser formatado
   * @returns Nome formatado ou string vazia quando `nomeCompleto` for falsy
   */
  static formatName(nomeCompleto: string): string {
    const palavrasMinusculas = ['de', 'da', 'do', 'dos', 'das', 'e'];

    if (nomeCompleto) {
      nomeCompleto = ` ${nomeCompleto} `.replace(/[\s ]+]/g, ' ');
      nomeCompleto = nomeCompleto.substring(1, nomeCompleto.length-1);
      return nomeCompleto
        .toLowerCase()
        .split(' ')
        .map((palavra, index) => {
          if (index === 0 || !palavrasMinusculas.includes(palavra)) {
            return palavra.charAt(0).toUpperCase() + palavra.slice(1);
          }
          return palavra;
        })
        .join(' ');
    }

    return '';
  }

  /**
   * Recebe um texto HTML e retorna ele decodificado
   * @param text texto a ser decodificado
   * @returns o texto decodificado
   */
  static htmlDecode(text: string): string {
    const div = document.createElement('div');
    div.innerHTML = text ?? '';
    return div.textContent || div.innerText;
  }

  /**
   * Codifica uma string para uso em URL (`encodeURIComponent`).
   * @param value Texto a ser codificado
   * @returns Texto codificado ou string vazia quando `value` for undefined
   */
   static urlEncode(value?: string): string {
    return encodeURIComponent(value ?? '');
  }

  /**
   * Encurta blocos de texto muito longos inserindo `..` quando um trecho sem espaços excede o limite.
   * @param value Texto a ser avaliado
   * @param lenght Limite de caracteres contíguos sem espaços após o qual o texto será truncado
   * @returns Texto possivelmente encurtado ou `null` quando `value` for nulo/indefinido
   */
   static breakText(value: string, lenght: number): string {
    const regex = new RegExp(`([^\s<>]{${lenght}})([^\s<>]+)`);
    return value?.replace(regex, '$1..') ?? null;
  }

  /**
   * Retorna `true` se a string for nula, undefined ou composta apenas por espaços.
   * @param value Texto a ser verificado
   * @returns Booleano indicando se é nulo/vazio
   */
  static isNullOrEmpty(value: string): boolean {
    return !value || value === null
      || value === undefined || StringUtils.trim(value) === '' ? true : false;
  }

  /**
   * Substitui sequências de dois ou mais espaços por um único espaço.
   * @param value Texto a ser normalizado
   * @returns Texto sem sequências longas de espaços
   */
  static singleSpace(value: string): string {
    return value?.replace(/ {2,}/g, ' ') ?? '';
  }

  /**
   * Remove espaços em branco do início e fim da string.
   * @param value Texto a ser aparado
   * @returns Texto sem espaços nas extremidades
   */
  static trim(value: string): string {
    return value?.replace(/^\s+|\s+$/g, '') ?? '';
  }

  /**
   * Retorna `newValue` quando `value` for `null` ou `undefined`.
   * @param value Valor atual
   * @param newValue Valor padrão a ser retornado quando `value` for nulo/indefinido
   * @returns `value` quando presente, caso contrário `newValue`
   */
  static defaultNull(value: string, newValue: string): string {
    return value ?? newValue;
  }

  /**
   * Substitui o valor atual se for vazio
   * @param value valor atual
   * @param newValue novo valor
   */
  static defaultEmpty(value: string, newValue: string): string {
    if (value === '') {
      value = newValue;
    }
    return value;
  }

  /**
   * Substitui o valor atual se for vazio, nulo ou indefinido
   * @param value valor atual
   * @param newValue novo valor
   */
  static defaultNullOrEmpty(value: string, newValue: string): string {
    if (value === '') {
      value = newValue;
    }
    return value ?? newValue;
  }

  static getQuerySyntax(key: string, value: string): string[] {
    value = this.singleSpace(value);
    if (value) {
      const regex = new RegExp(`\\s*${key}:.+`, 'g');
      let values: string[] = value.match(regex) || [];
      values = values.map(x => x.split(':')[1].replace(/[\(\)]+/g, ''));
      return values;
    }

    return [];
  }

  /**
   * Remove ocorrências do padrão `key:...` da string de busca.
   * @param key Chave a ser removida
   * @param value Texto de entrada
   * @returns Texto sem as expressões `key:valor`
   */

  static removeQuerySyntax(key: string, value: string): string {
    value = this.singleSpace(value);

    if (value) {
      const regex = new RegExp(`\\s*${key}:([^\\s\\(\\):]+|\\([^\\(\\):]+\\))\\s*`, 'g');
      value = value.replace(regex, ' ');
      value = this.singleSpace(value);
    }

    return value;
  }

  /**
   * Extrai GUIDs presentes no texto.
   * @param value Texto de entrada
   * @returns Array de GUIDs encontrados (ou array vazio)
   */
  static getGuid(value: string): string[] {
    value = this.singleSpace(value);

    const regex = /\\s*\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\b\\s*/g;
    return value ? value.match(regex) || [] : [];
  }

  /**
   * Remove GUIDs do texto e normaliza espaços.
   * @param value Texto de entrada
   * @returns Texto sem GUIDs
   */
  static removeGuid(value: string): string {
    value = this.singleSpace(value);
    const regex = /\\s*\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\b\\s*/g;
    return value ? this.singleSpace(value.replace(regex, ' ')) : value;
  }
}
