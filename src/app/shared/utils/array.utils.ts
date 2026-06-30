/**
 * Ordenar um array de objetos com base em uma chave específica.
 * @param array O array de objetos a ser ordenado.
 * @param key A chave do objeto pela qual o array será ordenado.
 * @param ascending Determina se a ordenação será crescente (true) ou decrescente (false).
 * @returns O array ordenado.
 * 
 * @example
 * const users = [
 *   { name: 'Alice', age: 30 },
 *   { name: 'Bob', age: 25 },
 * ];
 * const sortedUsers = orderBy(users, 'age', true);
 * result: [
 *   { name: 'Bob', age: 25 },
 *   { name: 'Alice', age: 30 },
 * ]
 */
export function orderByKey<T>(array: T[], key: keyof T, ascending: boolean = true): T[] {
  return array.sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA < valueB) {
      return ascending ? -1 : 1;
    }
    if (valueA > valueB) {
      return ascending ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Ordenar um array de objetos com base em múltiplas chaves. 
 * @param array O array de objetos a ser ordenado. 
 * @param keys As chaves do objeto pelas quais o array será ordenado. 
 * @param ascending Determina se a ordenação será crescente (true) ou decrescente (false). 
 * @returns O array ordenado.
 * 
 * @example
 * const users = [
 *   { name: 'Alice', age: 30 },
 *   { name: 'Bob', age: 25 },
 *   { name: 'Charlie', age: 30 },
 * ]; 
 * const sortedUsers = orderByKeys(users, ['age', 'name'], true);
 * result: [
 *   { name: 'Bob', age: 25 },
 *   { name: 'Alice', age: 30 },
 *   { name: 'Charlie', age: 30 },
 * ]
 */
export function orderByKeys<T>(array: T[], keys: (keyof T)[], ascending: boolean = true): T[] {
  return array.sort((a, b) => {
    for (const key of keys) {
      const valueA = a[key];
      const valueB = b[key];

      if (valueA < valueB) {
        return ascending ? -1 : 1;
      }
      if (valueA > valueB) {
        return ascending ? 1 : -1;
      }
    }
    return 0;
  });
}

/**
 * Move um elemento dentro do array de uma posição para outra (modifica o array original).
 * @param array Array que será modificado (opera in-place)
 * @param oldIndex Índice atual do elemento a ser movido (pode ser negativo para contar a partir do fim)
 * @param newIndex Novo índice onde o elemento deverá ser inserido (pode ser negativo)
 * @returns `void` — o array é alterado diretamente
 * 
 * @example
 * const arr = ['a', 'b', 'c', 'd'];
 * moveIndexTo(arr, 1, 3);
 * console.log(arr); // ['a', 'c', 'd', 'b']
 */
export function moveIndexTo<T>(array: T[], oldIndex: number, newIndex: number): void {
  if (oldIndex < 0) {
    oldIndex = array.length + oldIndex;
  }
  if (newIndex < 0) {
    newIndex = array.length + newIndex;
  }
  if (oldIndex >= array.length || newIndex >= array.length || oldIndex < 0 || newIndex < 0) {
    throw new Error('Índices fora do intervalo do array');
  }
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
}

/**
 * Move o item uma posição para cima (índice - 1). Se estiver no início, envia para o fim.
 * @param array Array que contém o item (modificado in-place)
 * @param item Item a ser movido (comparado por referência)
 * @returns O novo índice do item no array após o movimento
 * 
 * @example
 * const arr = ['a', 'b', 'c', 'd'];
 * moveIndexToUp(arr, 'b');
 * console.log(arr); // ['b', 'a', 'c', 'd']
 */
export function moveIndexToUp<T>(array: T[], item: T): number {
  const currentValue: number = array.indexOf(item);
  let newValue = currentValue - 1;
  if (newValue < 0) {
    newValue = array.length - 1;
  }
  moveIndexTo(array, currentValue, newValue);
  return newValue;
}

/**
 * Move o item uma posição para baixo (índice + 1). Se estiver no fim, envia para o início.
 * @param array Array que contém o item (modificado in-place)
 * @param item Item a ser movido (comparado por referência)
 * @returns O novo índice do item no array após o movimento
 * 
 * @example
 * const arr = ['a', 'b', 'c', 'd'];
 * moveIndexToDown(arr, 'c');
 * console.log(arr); // ['a', 'b', 'd', 'c']
 */
export function moveIndexToDown<T>(array: T[], item: T): number {
  const currentValue: number = array.indexOf(item);
  let newValue = currentValue + 1;
  if (newValue >= array.length) {
    newValue = 0;
  }
  moveIndexTo(array, currentValue, newValue);
  return newValue;
}