import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormTextarea } from './form-textarea';

@Component({
  imports: [ ReactiveFormsModule, FormTextarea ],
  template: `<app-form-textarea label="Descrição" [formControl]="control" />`
})
class HostTextarea {
  control = new FormControl<string | null>(null);
}

@Component({
  imports: [ ReactiveFormsModule, FormTextarea ],
  template: `<app-form-textarea label="Descrição" readonly [formControl]="control" />`
})
class HostReadonly {
  control = new FormControl<string | null>('abc');
}

@Component({
  imports: [ ReactiveFormsModule, FormTextarea ],
  template: `<app-form-textarea label="Descrição" [loading]="loading()" [formControl]="control" />`
})
class HostLoading {
  loading = signal(true);
  control = new FormControl<string | null>('abc');
}

@Component({
  imports: [ ReactiveFormsModule, FormTextarea ],
  template: `<app-form-textarea label="Descrição" [formControl]="control" />`
})
class HostRows {
  control = new FormControl<string | null>(null);
}

@Component({
  imports: [ ReactiveFormsModule, FormTextarea ],
  template: `<app-form-textarea label="Descrição" rows="8" [formControl]="control" />`
})
class HostRowsCustom {
  control = new FormControl<string | null>(null);
}

@Component({
  imports: [ ReactiveFormsModule, FormTextarea ],
  template: `<app-form-textarea label="Descrição" [formControl]="control" />`
})
class HostRequired {
  control = new FormControl<string | null>(null, Validators.required);
}

function createHost<T>(type: new () => T) {
  TestBed.configureTestingModule({ imports: [ type ], providers: [ provideZonelessChangeDetection() ] });
  const fixture = TestBed.createComponent(type);
  fixture.detectChanges();
  const area = fixture.debugElement.query(By.directive(FormTextarea));
  return {
    fixture,
    host: fixture.componentInstance,
    component: area.componentInstance as FormTextarea,
    textarea: area.query(By.css('textarea')).nativeElement as HTMLTextAreaElement,
    root: area.nativeElement as HTMLElement,
  };
}

describe('FormTextarea comportamento atual', () => {

  it('readonly oculta o botão de limpar mesmo com valor', () => {
    const { textarea, root } = createHost(HostReadonly);

    expect(textarea.readOnly).toBeTrue();
    expect(root.querySelector('button.action-clear')).toBeNull();
  });

  it('disabled oculta o botão de limpar mesmo com valor', () => {
    const { fixture, host, textarea, root } = createHost(HostTextarea);
    host.control.setValue('abc');
    host.control.disable();
    fixture.detectChanges();

    expect(textarea.disabled).toBeTrue();
    expect(root.querySelector('button.action-clear')).toBeNull();
  });

  it('rows padrão é 5', () => {
    const { textarea } = createHost(HostRows);

    expect(textarea.rows).toBe(5);
  });

  it('rows informado é respeitado', () => {
    const { textarea } = createHost(HostRowsCustom);

    expect(textarea.rows).toBe(8);
  });

  it('limpar redefine o valor, restaura pristine e untouched e devolve o foco ao textarea', () => {
    const { fixture, component, textarea, host } = createHost(HostTextarea);
    host.control.setValue('abc');
    textarea.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    component.clear();
    fixture.detectChanges();

    expect(host.control.value).toBeNull();
    expect(host.control.pristine).toBeTrue();
    expect(host.control.untouched).toBeTrue();
    expect(document.activeElement).toBe(textarea);
  });
});

describe('FormTextarea carregamento', () => {

  it('loading oculta o botão de limpar mesmo com valor', () => {
    const { textarea, root } = createHost(HostLoading);

    expect(textarea.readOnly).toBeTrue();
    expect(root.querySelector('button.action-clear')).toBeNull();
  });

  it('ao desativar loading o botão de limpar volta a ser exibido', () => {
    const { fixture, host, root } = createHost(HostLoading);

    host.loading.set(false);
    fixture.detectChanges();

    expect(root.querySelector('button.action-clear')).not.toBeNull();
  });
});

describe('FormTextarea valor vazio', () => {

  it('apagar o texto digitado resulta em null no FormControl', () => {
    const { host, textarea } = createHost(HostTextarea);

    textarea.value = 'abc';
    textarea.dispatchEvent(new Event('input'));
    textarea.value = '';
    textarea.dispatchEvent(new Event('input'));

    expect(host.control.value).toBeNull();
  });

  it('escrita programática de string vazia resulta em null no FormControl e permanece pristine', () => {
    const { fixture, component, textarea, host } = createHost(HostTextarea);

    host.control.setValue('');
    fixture.detectChanges();

    expect(host.control.value).toBeNull();
    expect(host.control.pristine).toBeTrue();
    expect(component.value).toBeNull();
    expect(textarea.value).toBe('');
  });
});
