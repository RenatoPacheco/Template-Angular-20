import { Injectable } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

type ValidationMessageFn =
  (error: any, field: string) => string;

type ValidationMessageMap = {
  [key: string]: ValidationMessageFn;
};

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  getMessages(
    errors: ValidationErrors | null,
    fields: string = 'Campo'
  ): string[] {

    if (!errors) {
      return [];
    }

    return Object.keys(errors)
      .filter(key => this.messages[key])
      .map(key => this.messages[key](errors[key], fields));
  } 

  private readonly messages: ValidationMessageMap = {
    required: (e: any, field: string = "Campo") => `${field} é obrigatório(a).`,
    email: (e: any, field: string = "Campo") => `${field} não contém um e-mail inválido.`,
    cpf: (e: any, field: string = "Campo") => `${field} não contém um CPF inválido.`,
    cnpj: (e: any, field: string = "Campo") => `${field} não contém um CNPJ inválido.`,
    alias: (e: any, field: string = "Campo") => `${field} contém um alias inválido.`,
    uppercase: (e: any, field: string = "Campo") =>
      `${field} deve conter ao menos uma letra maiúscula.`,
    lowercase: (e: any, field: string = "Campo") =>
      `${field} deve conter ao menos uma letra minúscula.`,
    number: (e: any, field: string = "Campo") =>
      `${field} deve conter ao menos um número.`,
    specialChar: (e: any, field: string = "Campo") =>
      `${field} deve conter ao menos um caractere especial.`,
    minlength: (e: {
      actualLength: number,
      requiredLength: number
    }, field: string = "Campo") =>
      `${field} deve ter no mínimo ${e.requiredLength} caracteres.`,
    maxlength: (e: {
      actualLength: number,
      requiredLength: number
    }, field: string = "Campo") =>
      `${field} deve ter no máximo ${e.requiredLength} caracteres.`,
    compare: (e: {
      compareRef: string,
      compareLabel: string
    }, field: string = "Campo") =>
      `${field} deve ser igual à ${e.compareLabel}.`,
  };
}