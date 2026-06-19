/** Possui métodos que facilitam a manipulação da classe FormData */
export class FormDataUtils {

    /**
     * Adiciona um item ao `FormData`. Se `value` for um array, adiciona cada elemento separadamente.
     * @param out `FormData` que será populado (retornado atualizado)
     * @param key Chave a ser utilizada no `FormData`
     * @param value Valor a ser adicionado; aceita `File`, `string`, `Blob` ou `Array` desses valores
     * @returns O `FormData` atualizado
     */
    static setItem(out: FormData, key: string, value: any): FormData {
        if (value !== undefined && value !== null) {
            if (value instanceof Array) {
                value.forEach(element => {
                    out = FormDataUtils.setItem(out, key, element);
                });
            } else {
                out.append(key, value);
            }
        }
        return out;
    }

        /**
         * Popula um `FormData` a partir de um objeto, navegando recursivamente em sub-objetos.
         * @param out `FormData` que será populado (retornado atualizado)
         * @param params Objeto de origem dos dados a serem incluídos no `FormData`
         * @param prefix Prefixo opcional aplicado às chaves (útil para objetos aninhados)
         * @returns O `FormData` atualizado
         */
        static setObject(out: FormData, params: object, prefix: string = ''): FormData {
      let value: any = null;
      let obj: any = params;
        if (obj !== undefined && obj !== null) {
            Object.keys(obj).forEach(key => {
                value = obj[key];
                if (value instanceof Object && !(value instanceof File) && !(value instanceof Array)) {
                    out = FormDataUtils.setObject(out, value, `${prefix}${key}.`);
                } else {
                    out = FormDataUtils.setItem(out, `${prefix}${key}`, value);
                }
            });
        }
        return out;
    }
}
