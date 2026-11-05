import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormText } from './form-text';

@Component({
  imports: [ ReactiveFormsModule, FormText ],
  template: `<app-form-text label="Nome" [formControl]="control" />`
})
class HostText {
  control = new FormControl<string | null>(null);
}

@Component({
  imports: [ FormText ],
  template: `<app-form-text label="Nome" />`
})
class HostWithoutControl {}

@Component({
  imports: [ ReactiveFormsModule, FormText ],
  template: `<app-form-text label="CPF" id="cpf" [formControl]="control" />`
})
class HostWithId {
  control = new FormControl<string | null>(null);
}

function setup(prepare?: (host: HostText) => void) {
  TestBed.configureTestingModule({ imports: [ HostText ], providers: [ provideZonelessChangeDetection() ] });
  const fixture = TestBed.createComponent(HostText);
  prepare?.(fixture.componentInstance);
  fixture.detectChanges();

  const text = fixture.debugElement.query(By.directive(FormText));
  return {
    fixture,
    host: fixture.componentInstance,
    component: text.componentInstance as FormText,
    input: text.query(By.css('input')).nativeElement as HTMLInputElement,
    root: text.nativeElement as HTMLElement,
  };
}

describe('FormText com FormControl (form-element-contract)', () => {

  it('falha ao criar sem FormControl', () => {
    TestBed.configureTestingModule({ imports: [ HostWithoutControl ], providers: [ provideZonelessChangeDetection() ] });
    expect(() => {
      TestBed.createComponent(HostWithoutControl).detectChanges();
    }).toThrow();
  });

  it('escrita programática exibe o valor e mantém o control pristine', () => {
    const { fixture, input, host } = setup();

    host.control.setValue('abc');
    fixture.detectChanges();

    expect(input.value).toBe('abc');
    expect(host.control.pristine).toBeTrue();
  });

  it('reset restaura estado limpo após alteração do usuário', () => {
    const { fixture, input, host } = setup();

    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(host.control.dirty).toBeTrue();

    host.control.reset();
    fixture.detectChanges();

    expect(host.control.pristine).toBeTrue();
    expect(host.control.untouched).toBeTrue();
  });

  it('digitação atualiza o modelo uma única vez', () => {
    const { input, host } = setup();
    const emitted: unknown[] = [];
    host.control.valueChanges.subscribe(v => emitted.push(v));

    input.value = 'abc';
    input.dispatchEvent(new Event('input'));

    expect(host.control.value).toBe('abc');
    expect(host.control.dirty).toBeTrue();
    expect(emitted).toEqual(['abc']);
  });

  it('sair do campo marca touched sem alterar pristine', () => {
    const { input, host } = setup();

    input.dispatchEvent(new Event('blur'));

    expect(host.control.touched).toBeTrue();
    expect(host.control.pristine).toBeTrue();
  });

  it('exibe estado inválido na primeira renderização', () => {
    const { component } = setup(host => {
      host.control.setValidators(Validators.required);
      host.control.updateValueAndValidity();
    });

    expect(component.isInvalid()).toBeTrue();
  });

  it('reflete disable() feito pelo control', () => {
    const { fixture, input, component, host } = setup();

    host.control.disable();
    fixture.detectChanges();

    expect(component.disabled).toBeTrue();
    expect(input.disabled).toBeTrue();
  });

  it('gera ids únicos quando o consumidor não informa um', () => {
    TestBed.configureTestingModule({ imports: [ HostText ], providers: [ provideZonelessChangeDetection() ] });
    const first = TestBed.createComponent(HostText);
    const second = TestBed.createComponent(HostText);
    first.detectChanges();
    second.detectChanges();

    const idOf = (f: typeof first) =>
      (f.debugElement.query(By.directive(FormText)).componentInstance as FormText).id;

    expect(idOf(first)).toBeTruthy();
    expect(idOf(first)).not.toBe(idOf(second));
  });

  it('usa o id informado pelo consumidor', () => {
    TestBed.configureTestingModule({ imports: [ HostWithId ], providers: [ provideZonelessChangeDetection() ] });
    const fixture = TestBed.createComponent(HostWithId);
    fixture.detectChanges();

    const text = fixture.debugElement.query(By.directive(FormText)).componentInstance as FormText;
    expect(text.id).toBe('cpf');
  });

  it('limpar redefine o valor e devolve o foco ao campo', () => {
    const { fixture, component, input, host } = setup();
    host.control.setValue('abc');
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    component.clear();
    fixture.detectChanges();

    expect(host.control.value).toBeNull();
    expect(host.control.pristine).toBeTrue();
    expect(host.control.untouched).toBeTrue();
    expect(document.activeElement).toBe(input);
  });
});

@Component({
  imports: [ ReactiveFormsModule, FormText ],
  template: `<app-form-text label="Nome" readonly [formControl]="control" />`
})
class HostReadonly {
  control = new FormControl<string | null>('abc');
}

@Component({
  imports: [ ReactiveFormsModule, FormText ],
  template: `<app-form-text label="CPF" transform="cpf" [formControl]="control" />`
})
class HostCpf {
  control = new FormControl<string | null>(null);
}

@Component({
  imports: [ ReactiveFormsModule, FormText ],
  template: `<app-form-text label="Nome" enabled-helper [formControl]="control" />`
})
class HostHelper {
  control = new FormControl<string | null>(null);
}

@Component({
  imports: [ ReactiveFormsModule, FormText ],
  template: `<app-form-text label="Nome" [formControl]="control" />`
})
class HostRequired {
  control = new FormControl<string | null>(null, Validators.required);
}

@Component({
  imports: [ ReactiveFormsModule, FormText ],
  template: `<app-form-text label="Nome" [loading]="loading()" [formControl]="control" />`
})
class HostLoading {
  loading = signal(true);
  control = new FormControl<string | null>('abc');
}

function createHost<T>(type: new () => T) {
  TestBed.configureTestingModule({ imports: [ type ], providers: [ provideZonelessChangeDetection() ] });
  const fixture = TestBed.createComponent(type);
  fixture.detectChanges();
  const text = fixture.debugElement.query(By.directive(FormText));
  return {
    fixture,
    host: fixture.componentInstance,
    component: text.componentInstance as FormText,
    input: text.query(By.css('input')).nativeElement as HTMLInputElement,
    root: text.nativeElement as HTMLElement,
  };
}

describe('FormText comportamento atual (cobertura)', () => {

  it('readonly oculta os botões de ação mesmo com valor', () => {
    const { input, root } = createHost(HostReadonly);

    expect(input.readOnly).toBeTrue();
    expect(root.querySelector('button.action-clear')).toBeNull();
  });

  it('disabled oculta os botões de ação mesmo com valor', () => {
    const { fixture, input, host, root } = setup();
    host.control.setValue('abc');
    host.control.disable();
    fixture.detectChanges();

    expect(input.disabled).toBeTrue();
    expect(root.querySelector('button.action-clear')).toBeNull();
  });

  it('transform cpf formata o valor digitado e o model', () => {
    const { input, host } = createHost(HostCpf);

    input.value = '12345678909';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('123.456.789-09');
    expect(host.control.value).toBe('123.456.789-09');
  });

  it('enabled-helper emite helper ao clicar na ajuda', () => {
    const { fixture, component, root } = createHost(HostHelper);
    const emitted: void[] = [];
    component.helper.subscribe(() => emitted.push(undefined));

    (root.querySelector('i[role="help"]') as HTMLElement).click();
    fixture.detectChanges();

    expect(emitted.length).toBe(1);
  });

  it('clique no alerta emite error com as mensagens do controle', () => {
    const { fixture, component, input, host, root } = createHost(HostRequired);
    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(host.control.invalid).toBeTrue();

    const emitted: { messages: string[] }[] = [];
    component.error.subscribe(e => emitted.push(e));

    (root.querySelector('i[role="alert"]') as HTMLElement).click();
    fixture.detectChanges();

    expect(emitted.length).toBe(1);
    expect(emitted[0].messages.length).toBeGreaterThan(0);
  });
});

describe('FormText carregamento', () => {

  it('loading oculta o botão de limpar mesmo com valor', () => {
    const { input, root } = createHost(HostLoading);

    expect(input.readOnly).toBeTrue();
    expect(root.querySelector('button.action-clear')).toBeNull();
  });

  it('ao desativar loading o botão de limpar volta a ser exibido', () => {
    const { fixture, host, root } = createHost(HostLoading);

    host.loading.set(false);
    fixture.detectChanges();

    expect(root.querySelector('button.action-clear')).not.toBeNull();
  });
});

@Component({
  imports: [ ReactiveFormsModule, FormText ],
  template: `<app-form-text label="Texto" type="text" control-secret [formControl]="control" />`
})
class HostSecretText {
  control = new FormControl<string | null>('abc');
}

@Component({
  imports: [ ReactiveFormsModule, FormText ],
  template: `<app-form-text label="Email" type="email" control-secret [formControl]="control" />`
})
class HostSecretEmail {
  control = new FormControl<string | null>('abc');
}

@Component({
  imports: [ ReactiveFormsModule, FormText ],
  template: `<app-form-text label="Busca" type="search" control-secret [formControl]="control" />`
})
class HostSecretSearch {
  control = new FormControl<string | null>('abc');
}

@Component({
  imports: [ ReactiveFormsModule, FormText ],
  template: `<app-form-text label="Senha" type="password" [formControl]="control" />`
})
class HostPasswordPlain {
  control = new FormControl<string | null>('abc');
}

describe('FormText control-secret', () => {

  it('inicia mascarado em type text', () => {
    const { input, root } = createHost(HostSecretText);

    expect(input.type).toBe('password');
    expect(input.parentElement!.classList).toContain('action-show');
    expect(input.parentElement!.classList).not.toContain('action-hide');
  });

  it('inicia mascarado em type email', () => {
    const { input, root } = createHost(HostSecretEmail);

    expect(input.type).toBe('password');
    expect(input.parentElement!.classList).toContain('action-show');
  });

  it('revelar em email volta ao type email e ocultar volta a password', () => {
    const { fixture, input, root } = createHost(HostSecretEmail);

    (root.querySelector('button.action-show') as HTMLElement).click();
    fixture.detectChanges();
    expect(input.type).toBe('email');
    expect(input.parentElement!.classList).toContain('action-hide');

    (root.querySelector('button.action-hide') as HTMLElement).click();
    fixture.detectChanges();
    expect(input.type).toBe('password');
    expect(input.parentElement!.classList).toContain('action-show');
  });

  it('search revelado vira text', () => {
    const { fixture, input, root } = createHost(HostSecretSearch);

    (root.querySelector('button.action-show') as HTMLElement).click();
    fixture.detectChanges();

    expect(input.type).toBe('text');
  });

  it('limpar campo revelado volta a mascarar', () => {
    const { fixture, component, input, root } = createHost(HostSecretText);

    (root.querySelector('button.action-show') as HTMLElement).click();
    fixture.detectChanges();
    expect(input.type).toBe('text');

    component.clear();
    fixture.detectChanges();

    expect(input.type).toBe('password');
    expect(input.parentElement!.classList).toContain('action-show');
  });

  it('campo sem control-secret não tem botões de alternância', () => {
    const { input, root } = createHost(HostPasswordPlain);

    expect(input.type).toBe('password');
    expect(input.parentElement!.classList).not.toContain('action-show');
    expect(input.parentElement!.classList).not.toContain('action-hide');
  });
});

describe('FormText valor vazio', () => {

  it('apagar o texto digitado resulta em null no FormControl', () => {
    const { input, host } = setup();

    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    input.value = '';
    input.dispatchEvent(new Event('input'));

    expect(host.control.value).toBeNull();
  });

  it('escrita programática de string vazia resulta em valor null no FormControl e no componente', () => {
    const { fixture, component, input, host } = setup();

    host.control.setValue('');
    fixture.detectChanges();

    expect(host.control.value).toBeNull();
    expect(host.control.pristine).toBeTrue();
    expect(component.value).toBeNull();
    expect(input.value).toBe('');
  });
});
