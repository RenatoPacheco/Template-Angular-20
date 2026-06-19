export class WindowUtils {

  /**
   * Obtém o primeiro valor de um parâmetro na query string de uma URL.
   * @param name Nome do parâmetro a ser buscado
   * @param url URL a ser analisada; por padrão `window.location.href`
   * @returns Valor do parâmetro ou `null` quando não encontrado
   */
  static getParameterByName(name: string, url: string = window.location.href): string|null {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  /** Obtém a altura atual da janela */
  static get height(): number {
    return 'innerHeight' in window
              ? window.innerHeight
              : document.documentElement.offsetHeight;
  }

  /** Obtém a largura atual da janela */
  static get width(): number {
    return 'innerWidth' in window
              ? window.innerWidth
              : document.documentElement.offsetWidth;
  }

  /** Retorna `true` se a aplicação estiver dentro de um iframe */
  static get inIframe(): boolean {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
  }
}
