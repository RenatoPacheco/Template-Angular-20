import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { aliasValidator } from './alias.validator';
import { cnpjValidator } from './cnpj.validator';
import { compareValidator } from './compare.validator';
import { cpfValidator } from './cpf.validator';
import { DateFormat, dateValidator } from './date.validator';
import { passwordValidator } from './password.validator';
import { timeSpanValidator } from './timespan.validator';
import { dateTimeValidator } from './datetime.validator';
import { phonePtBrValidator } from './phone-ptbr.validator';


export class CustomValidators {

  public static readonly cpf = cpfValidator;
  public static readonly cnpj = cnpjValidator;
  public static readonly alias = aliasValidator;
  public static readonly password = passwordValidator;
  public static readonly timeSpan = timeSpanValidator;

  public static phonePtBr(param?: {
    format?: 'formatted' | 'numbers' | 'both',
    type?: 'cellphone' | 'landline' | 'both'
  }) {
    return phonePtBrValidator(param);
  }
  
  public static date(format?: DateFormat) {
    return dateValidator(format);
  }

  public static dateTime(format?: DateFormat) {
    return dateTimeValidator(format);
  }
    
  public static compare(
    compareRef: string,
    compareLabel: string
  ): ValidatorFn {
    return compareValidator(compareRef, compareLabel);
  }
}