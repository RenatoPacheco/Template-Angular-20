import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AbstractControl, FormControl, Validators } from '@angular/forms';

import { Label } from './label';
import { ToastService } from '@app/core';

@Component({
  imports: [ Label ],
  template: `<label app-label [state]="state"></label>`
})
class HostLabelState {
  state: 'valid' | 'invalid' | null = null;
}

@Component({
  imports: [ Label ],
  template: `<label app-label [control]="control()" [enabled-error]="enabledError" [state]="state"></label>`
})
class HostLabelControl {
  control = signal<AbstractControl | null>(new FormControl<string | null>('', Validators.required));
  enabledError = true;
  state: 'valid' | 'invalid' | null = null;
}

@Component({
  imports: [ Label ],
  template: `<label app-label enabled-error></label>`
})
class HostLabelNoControl {}

function createState(state: 'valid' | 'invalid' | null) {
  TestBed.configureTestingModule({ imports: [ HostLabelState ], providers: [ provideZonelessChangeDetection() ] });
  const fixture = TestBed.createComponent(HostLabelState);
  fixture.componentInstance.state = state;
  fixture.detectChanges();
  const label = fixture.debugElement.query(By.directive(Label)).nativeElement as HTMLElement;
  return { fixture, label };
}

function createControl() {
  TestBed.configureTestingModule({ imports: [ HostLabelControl ], providers: [ provideZonelessChangeDetection() ] });
  const fixture = TestBed.createComponent(HostLabelControl);
  fixture.detectChanges();
  const label = fixture.debugElement.query(By.directive(Label)).nativeElement as HTMLElement;
  return { fixture, label, host: fixture.componentInstance };
}

describe('Label', () => {

  describe('Estado visual por propriedade', () => {

    it('state invalid aplica is-invalid no host', () => {
      const { label } = createState('invalid');
      expect(label.classList).toContain('is-invalid');
      expect(label.classList).not.toContain('is-valid');
    });

    it('state valid aplica is-valid no host', () => {
      const { label } = createState('valid');
      expect(label.classList).toContain('is-valid');
      expect(label.classList).not.toContain('is-invalid');
    });
  });

  describe('Sem estado', () => {

    it('state nulo não aplica nenhuma classe de estado', () => {
      const { label } = createState(null);
      expect(label.classList).not.toContain('is-valid');
      expect(label.classList).not.toContain('is-invalid');
    });
  });

  describe('Erro a partir de um controle', () => {

    it('erro visível após interação aplica is-invalid no host', () => {
      const { fixture, label, host } = createControl();
      host.control()!.markAsTouched();
      host.control()!.markAsDirty();
      fixture.detectChanges();
      expect(label.classList).toContain('is-invalid');
      expect(label.querySelector('i.error')).not.toBeNull();
    });

    it('erro oculto antes da interação não aplica is-invalid', () => {
      const { label } = createControl();
      expect(label.classList).not.toContain('is-invalid');
      expect(label.querySelector('i.error')).toBeNull();
    });

    it('erro acompanha o controle sem ação sobre o label', () => {
      const { fixture, label, host } = createControl();
      const control = host.control() as FormControl<string | null>;
      expect(label.classList).not.toContain('is-invalid');
      control.markAsTouched();
      control.markAsDirty();
      fixture.detectChanges();
      expect(label.classList).toContain('is-invalid');
      control.setValue('ok');
      fixture.detectChanges();
      expect(label.classList).not.toContain('is-invalid');
    });

    it('troca de controle faz o erro refletir só o novo controle', () => {
      const { fixture, label, host } = createControl();
      const old = host.control() as FormControl<string | null>;
      const fresh = new FormControl<string | null>('ok', Validators.required);
      host.control.set(fresh);
      fixture.detectChanges();
      old.markAsTouched();
      old.markAsDirty();
      fixture.detectChanges();
      expect(label.classList).not.toContain('is-invalid');
      fresh.markAsTouched();
      fresh.markAsDirty();
      fresh.setValue('');
      fixture.detectChanges();
      expect(label.classList).toContain('is-invalid');
    });
  });

  describe('Precedência do estado explícito', () => {

    it('state valid prevalece sobre um controle inválido', () => {
      const { fixture, label, host } = createControl();
      host.state = 'valid';
      const control = host.control() as FormControl<string | null>;
      control.markAsTouched();
      control.markAsDirty();
      fixture.detectChanges();
      expect(label.classList).toContain('is-valid');
      expect(label.classList).not.toContain('is-invalid');
    });

    it('enabled-error falso suprime o erro mesmo com controle inválido', () => {
      const { fixture, label, host } = createControl();
      host.enabledError = false;
      const control = host.control() as FormControl<string | null>;
      control.markAsTouched();
      control.markAsDirty();
      fixture.detectChanges();
      expect(label.classList).not.toContain('is-invalid');
    });
  });

  describe('Toast gerado pelo label com controle', () => {

    it('clique no alerta com controle inválido gera toast com as mensagens', () => {
      const { fixture, label, host } = createControl();
      const toast = TestBed.inject(ToastService);
      const spy = spyOn(toast, 'error').and.returnValue('id');
      const control = host.control() as FormControl<string | null>;
      control.markAsTouched();
      control.markAsDirty();
      fixture.detectChanges();

      (label.querySelector('i.error') as HTMLElement).click();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.calls.mostRecent().args[0].message.length).toBeGreaterThan(0);
    });

    it('controle válido não cria toast vazio', () => {
      const { fixture, host } = createControl();
      const toast = TestBed.inject(ToastService);
      const spy = spyOn(toast, 'error').and.returnValue('id');
      host.control.set(new FormControl<string | null>('ok', Validators.required));
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.directive(Label)).componentInstance as Label;
      label['emitError']();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Saída error', () => {

    it('carrega as mensagens e os erros do controle quando há controle', () => {
      const { fixture, label, host } = createControl();
      const toast = TestBed.inject(ToastService);
      spyOn(toast, 'error').and.returnValue('id');
      const component = fixture.debugElement.query(By.directive(Label)).componentInstance as Label;
      const emitted = jasmine.createSpy('error');
      component.error.subscribe(emitted);
      const control = host.control() as FormControl<string | null>;
      control.markAsTouched();
      control.markAsDirty();
      fixture.detectChanges();

      (label.querySelector('i.error') as HTMLElement).click();

      const payload = emitted.calls.mostRecent().args[0];
      expect(payload.messages.length).toBeGreaterThan(0);
      expect(payload.errors).toEqual({ required: true });
    });
  });

  describe('Pai trata o erro', () => {

    it('sem controle, o clique emite somente a saída error e não cria toast', () => {
      TestBed.configureTestingModule({ imports: [ HostLabelNoControl ], providers: [ provideZonelessChangeDetection() ] });
      const fixture = TestBed.createComponent(HostLabelNoControl);
      fixture.detectChanges();
      const label = fixture.debugElement.query(By.directive(Label));
      const component = label.componentInstance as Label;
      const toast = TestBed.inject(ToastService);
      const spy = spyOn(toast, 'error').and.returnValue('id');
      const emitted = jasmine.createSpy('error');
      component.error.subscribe(emitted);

      (label.nativeElement.querySelector('i.error') as HTMLElement).click();

      expect(emitted).toHaveBeenCalledTimes(1);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
