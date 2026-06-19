import { FormArray, FormControl, FormGroup } from "@angular/forms";

/**
 * Marca todos os controles de um `FormGroup` ou `FormArray` como "dirty".
 * Percorre recursivamente grupos e arrays para garantir que todos os `FormControl` sejam marcados.
 * @param form `FormGroup` ou `FormArray` cujo controles serão marcados como dirty
 */
export function markAllControlsAsDirty(form: FormGroup | FormArray) {
  Object.values(form.controls).forEach(control => {
    if (control instanceof FormControl) {
      control.markAsDirty();
    } else if (control instanceof FormGroup || control instanceof FormArray) {
      markAllControlsAsDirty(control);
    }
  });
}

/**
 * Atualiza `value` e `validity` de todos os controles dentro de um `FormGroup` ou `FormArray`.
 * Percorre recursivamente e chama `updateValueAndValidity` em cada `FormControl`.
 * @param form `FormGroup` ou `FormArray` a ser atualizado
 * @param config Opções passadas para `updateValueAndValidity` (ex.: `onlySelf`, `emitEvent`)
 */
export function updateAllValueAndValidity(form: FormGroup | FormArray, config?: {
  onlySelf?: boolean;
  emitEvent?: boolean;
}) {
  Object.values(form.controls).forEach(control => {
    if (control instanceof FormControl) {
      control.updateValueAndValidity(config);
    } else if (control instanceof FormGroup || control instanceof FormArray) {
      updateAllValueAndValidity(control, config);
    }
  });
};
