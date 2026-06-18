import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cnpj' })
export class CnpjPipe implements PipeTransform {

  transform(value: string | number | null | undefined): string|null {

    if (!value) {
      return value?.toString()?.trim() || null;
    }

    const result = String(value)
      .replace(/\D[A-Z][a-z]/g, '')
      .slice(0, 14);

    const total = result.length;

    if (total <= 2) {
      return result;
    }
    
    if (total <= 5) {
      return result.replace(/(.{2})(.{1,3})/, '$1.$2');
    } 
    
    if (total <= 8) {
      return result.replace(/(.{2})(.{3})(.{1,3})/, '$1.$2.$3');
    }
    
    if (total <= 12) {
      return result.replace(/(.{2})(.{3})(.{3})(.{1,3})/, '$1.$2.$3/$4');
    }
    
    return result.replace(/(.{2})(.{3})(.{3})(.{4})(.{1,2})/, '$1.$2.$3/$4-$5');
  }
}