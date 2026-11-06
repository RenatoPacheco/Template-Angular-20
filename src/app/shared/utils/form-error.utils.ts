import { AbstractControl } from "@angular/forms";

/**
 * Indica se o erro de um controle deve ser exibido: o controle precisa estar inválido, ter sido tocado
 * e alterado, e o erro precisa estar habilitado.
 * @param control Controle a ser avaliado; `null` não exibe erro
 * @param enabledError Indica se a exibição de erro está habilitada
 * @returns `true` quando o erro deve ser exibido, caso contrário `false`
 */
export function isErrorVisible(control: AbstractControl | null, enabledError: boolean): boolean {
  return enabledError && !!control && control.invalid && control.touched && control.dirty;
}
