import { ElementRef } from "@angular/core";

/** Utilitários para operações relacionadas ao DOM/HTML */
export class HtmlUtils {

  /**
   * Verifica se o elemento está totalmente visível na viewport.
   * @param element `ElementRef` apontando para o elemento a ser verificado
   * @returns `true` se o elemento estiver completamente visível, caso contrário `false`
   */
  static isInViewport(element: ElementRef): boolean {
    const rect = element.nativeElement.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

}
