/**
 * Utilitários para manipulação de arrays (operações in-place).
 */
export class ArrayUtils {

  static join(arr: any[], separator: string = ', ', lastSeparator: string = ' e '): string {
    if (!arr || arr.length === 0) {
      return '';
    }
    if (arr.length === 1) {
      return String(arr[0]);
    }
    if (arr.length === 2) {
      return `${arr[0]}${lastSeparator}${arr[1]}`;
    }
    return `${arr.slice(0, -1).join(separator)}${lastSeparator}${arr[arr.length - 1]}`;
  }

  /**
   * Move um elemento dentro do array de uma posição para outra (modifica o array original).
   * @param arr Array que será modificado (opera in-place)
   * @param oldIndex Índice atual do elemento a ser movido (pode ser negativo para contar a partir do fim)
   * @param newIndex Novo índice onde o elemento deverá ser inserido (pode ser negativo)
   * @returns `void` — o array é alterado diretamente
   */
  static move(arr: any[], oldIndex: number, newIndex: number): void {
    while (oldIndex < 0) {
      oldIndex += arr.length;
    }
    while (newIndex < 0) {
      newIndex += arr.length;
    }
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length;
      while ((k--) + 1) {
          arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  }

  /**
   * Move o item uma posição para cima (índice - 1). Se estiver no início, envia para o fim.
   * @param arr Array que contém o item (modificado in-place)
   * @param item Item a ser movido (comparado por referência)
   * @returns O novo índice do item no array após o movimento
   */
  static moveUp(arr: any[], item: any): number {
    const currentValue: number = arr.indexOf(item);
    let newValue = currentValue - 1;
    if (newValue < 0) {
      newValue = arr.length - 1;
    }
    ArrayUtils.move(arr, currentValue, newValue);
    return newValue;
  }

  /**
   * Move o item uma posição para baixo (índice + 1). Se estiver no fim, envia para o início.
   * @param arr Array que contém o item (modificado in-place)
   * @param item Item a ser movido (comparado por referência)
   * @returns O novo índice do item no array após o movimento
   */
  static moveDown(arr: any[], item: any): number {
    const currentValue: number = arr.indexOf(item);
    let newValue = currentValue + 1;
    if (newValue >= arr.length) {
      newValue = 0;
    }
    ArrayUtils.move(arr, currentValue, newValue);
    return newValue;
  }
}
