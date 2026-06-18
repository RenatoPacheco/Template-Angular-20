import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cnpj' })
export class CnpjPipe implements PipeTransform {

  transform(value: string | number | null | undefined): string|null {

    value = value?.toString()?.trim() || null;

    const pattern = /^(\d{2}\.)$|^(\d{2}\.)(\d{3}\.)$|^(\d{2}\.)(\d{3}\.)(\d{3}\/)$|^(\d{2}\.)(\d{3}\.)(\d{3}\/)(\d{4}\-\d{0,2})$/;
    if (!value || RegExp(pattern).test(value)) {
      return value;
    }

    const result = String(value)
      .replace(/\D/g, '')
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