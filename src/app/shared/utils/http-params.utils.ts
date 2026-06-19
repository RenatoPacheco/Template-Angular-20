import { HttpParams } from '@angular/common/http';

/** Possui métodos que facilitam a manipulação da classe `HttpParams` */
export class HttpParamsUtils {

    /**
     * Adiciona um item ao `HttpParams`. Se `value` for um array, adiciona cada elemento separadamente.
     * @param out `HttpParams` que será atualizado e retornado
     * @param key Chave do parâmetro
     * @param value Valor do parâmetro; pode ser array para múltiplos valores
     * @returns `HttpParams` atualizado
     */
    static setItem(out: HttpParams, key: string, value: any): HttpParams {
        if (value !== undefined && value !== null) {
            if (value instanceof Array) {
                value.forEach(element => {
                    out = HttpParamsUtils.setItem(out, key, element);
                });
            } else {
                out = out.append(key, value);
            }
        }
        return out;
    }

    /**
     * Popula um `HttpParams` a partir de um objeto, navegando recursivamente em sub-objetos.
     * @param out `HttpParams` que será atualizado e retornado
     * @param params Objeto de origem dos dados
     * @param prefix Prefixo opcional aplicado às chaves geradas (para objetos aninhados)
     * @returns `HttpParams` atualizado
     */
    static setObject(out: HttpParams, params: object, prefix: string = ''): HttpParams {
        let value: any = null;
        let obj: any = params;
        if (obj !== undefined && obj !== null) {
            Object.keys(obj).forEach(key => {
                value = obj[key];
                if (value instanceof Object && !(value instanceof File) && !(value instanceof Array)) {
                    out = HttpParamsUtils.setObject(out, value, `${prefix}${key}.`);
                } else {
                    out = HttpParamsUtils.setItem(out, `${prefix}${key}`, value);
                }
            });
        }
        return out;
    }
}
