export class FileUtils {
  /**
   * Abre um arquivo Blob no navegador. Para IE/Edge usa `msSaveOrOpenBlob` se disponível.
   * @param file Blob contendo o conteúdo do arquivo
   * @param name Nome sugerido para o arquivo (não utilizado na abertura atual)
   */
  static open(file: Blob, name: string): void {
    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    const nav = (window?.navigator as any);
    if (isIEOrEdge && nav?.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(file);
    } else {
      const url = window.URL.createObjectURL(file);
      window.open(url);
    }
  }
}
