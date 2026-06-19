export class DocumentUtils {

  /** Obtém a altura atual do documento */
  static get height(): number {
    const body = document.body;
    const html = document.documentElement;
    return Math.max(body.scrollHeight, body.offsetHeight,
                    html.clientHeight, html.scrollHeight, html.offsetHeight );
  }

  /** Obtém a largura atual do documento */
  static get width(): number {
    const body = document.body;
    const html = document.documentElement;
    return Math.max(body.scrollWidth, body.offsetWidth,
                    html.clientWidth, html.scrollWidth, html.offsetWidth );
  }
}
