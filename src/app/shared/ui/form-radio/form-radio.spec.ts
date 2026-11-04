import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormRadio } from './form-radio';

@Component({
  imports: [ ReactiveFormsModule, FormRadio ],
  template: `
    <form [formGroup]="form">
      <app-form-radio formControlName="pick" group="pick" [value]="'id1'">A</app-form-radio>
      <app-form-radio formControlName="pick" group="pick" [value]="'id2'">B</app-form-radio>
    </form>
  `
})
class HostRadio {
  form = new FormGroup({ pick: new FormControl<string | null>(null) });
}

describe('FormRadio (form-check-options)', () => {

  it('apenas o radio do valor do modelo fica marcado após troca no grupo', () => {
    TestBed.configureTestingModule({ imports: [ HostRadio ], providers: [ provideZonelessChangeDetection() ] });
    const fixture = TestBed.createComponent(HostRadio);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const radios = fixture.debugElement
      .queryAll(By.css('input[type=radio]'))
      .map(d => d.nativeElement as HTMLInputElement);

    const control = host.form.controls.pick;

    control.setValue('id1');
    fixture.detectChanges();
    expect(radios[0].checked).toBeTrue();
    expect(radios[1].checked).toBeFalse();

    radios[1].click();
    fixture.detectChanges();

    expect(control.value).toBe('id2');
    expect(radios[0].checked).toBeFalse();
    expect(radios[1].checked).toBeTrue();
  });
});
