import { NavigationExtras, Router } from "@angular/router";

export class RouterUtils {
  /**
   * Navega para uma rota usando o `Router` do Angular.
   * Pode abrir a rota em nova aba/janela quando `newWindow` for `true`.
   * @param router Instância do `Router` para executar a navegação
   * @param commands Array de comandos/segmentos para `router.navigate` ou `createUrlTree`
   * @param extras `NavigationExtras` opcionais para a navegação
   * @param newWindow Quando `true`, constrói a URL e abre em nova aba/janela
   */
  public static goTo(
    router: Router, commands: any[],
    extras: NavigationExtras = {},
    newWindow: boolean = false): void {
      if (newWindow) {
        let url = document.getElementsByTagName('base')[0].href ?? '';
        url = url.replace(/[\/\s]+$/, '')
        url = url + router.serializeUrl(
          router.createUrlTree(commands, extras)
        );
        window.open(url, '_blank');
      } else {
        router.navigate(commands, extras);
      }
  }
}
