export class InputElementUtils {

  /**
   * Calcula a posição do cursor para manter a posição após a aplicação de uma máscara ou transformação no valor do input.
   * @param input O elemento de input HTML.
   * @param newValue O novo valor do input após a aplicação da máscara ou transformação.
   * @returns Um objeto contendo as posições de início e fim do cursor.
   */
  public static getToHoldPosition(input: HTMLInputElement, newValue: string): {
    start: number;
    end: number;
  } {
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    let value = input?.value ?? '';

    const currentBlock = value.substring(0, start);
    const newBlock = newValue.substring(0, start);
    if (newBlock !== currentBlock) {
      return {
        start: start + 1,
        end: end + 1,
      };
    } else {
      return {
        start: start,
        end: end,
      };
    }
  }
}