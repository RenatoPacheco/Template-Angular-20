import { aliasValidator } from './alias.validator';
import { cnpjValidator } from './cnpj.validator';
import { compareValidator } from './compare.validator';
import { cpfValidator } from './cpf.validator';
import { passwordValidator } from './password.validator';


export class CustonValidators {

  public static readonly cpf = cpfValidator;
  public static readonly cnpj = cnpjValidator;
  public static readonly alias = aliasValidator;
  public static readonly pasword = passwordValidator;
    
  public static compare(
    compareRef: string,
    compareLabel: string
  ) {
    compareValidator(compareRef, compareLabel);
  }
}