export class ObjectUtils {
  /**
   * Concatena propriedades de primeiro nível de múltiplos objetos em um novo objeto.
   * Propriedades com o mesmo nome serão sobrescritas pelo último objeto.
   * @param args Objetos de onde as propriedades serão copiadas
   * @returns Novo objeto contendo as propriedades concatenadas
   */
  static concat(...args: any[]): any {
    const newObj: any = {};
    for (const obj of args) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  }

  /**
   * Verifica se o valor é `null` ou `undefined`.
   * @param value Valor a ser verificado
   * @returns `true` quando `value` é `null` ou `undefined`
   */
  static isNullOrUndefined(value: any): boolean {
    return value === undefined || value === null;
  }

  /**
   * Verifica se o valor é considerado vazio: `null`, `undefined` ou string vazia (após trim).
   * @param value Valor a ser verificado
   * @returns `true` quando o valor for vazio
   */
  static isEmpty(value: any): boolean {
    return this.isNullOrUndefined(value) || (typeof value === "string" && value.trim() === "");
  }

  /**
   * Retorna `_default` quando `value` for vazio; caso contrário retorna `value`.
   * @param value Valor a ser avaliado
   * @param _default Valor padrão retornado quando `value` é vazio
   * @returns `value` quando presente, caso contrário `_default`
   */
  static getDefaultIfEmpty<T>(value: T|undefined|null, _default?: T|undefined|null): T|null|undefined {
    return this.isEmpty(value) ? _default : value ?? _default;
  }
}
