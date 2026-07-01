export class SecurityUtils {


  /**   
   * Gera um hash aleatório usando a API de criptografia do navegador.
   * O hash é gerado como uma string hexadecimal.
   * @param tamanho O comprimento desejado do hash (padrão: 50 caracteres)
   * @returns Uma string representando o hash gerado
   */
  public static generateHash(size: number = 50): string {
    if (size <= 32) {
      throw new Error('O tamanho mínimo recomendado para o hash é 32 caracteres.');
    }

    const bytes = new Uint8Array(Math.ceil(size / 2));
    crypto.getRandomValues(bytes);

    const hash = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, size);

    return hash;
  }

}