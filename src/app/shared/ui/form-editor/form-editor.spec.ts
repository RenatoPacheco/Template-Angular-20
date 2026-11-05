import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { FormEditor } from './form-editor';
import { PlataformLocationService } from '@app/shared/services';

@Component({
  imports: [ ReactiveFormsModule, FormEditor ],
  template: `<app-form-editor label="Texto" [formControl]="control" />`
})
class HostEditor {
  control = new FormControl<string | null>(null);
}

function createHost() {
  TestBed.configureTestingModule({ imports: [ HostEditor ], providers: [ provideZonelessChangeDetection() ] });
  const fixture = TestBed.createComponent(HostEditor);
  fixture.detectChanges();
  const editor = fixture.debugElement.query(By.directive(FormEditor)).componentInstance as FormEditor;
  return { fixture, editor };
}

function fakeEditorEvent() {
  const listeners: Record<string, () => void> = {};
  const editor = {
    on: (name: string, callback: () => void) => {
      listeners[name] = callback;
    },
    getCommand: () => ({ state: 2 }),
    destroy: () => listeners['destroy']?.(),
  };
  return { event: { editor } as unknown as { editor: unknown }, editor };
}

describe('FormEditor instâncias', () => {

  it('editor destruído é removido da lista de editores', () => {
    const { editor } = createHost();
    const { event, editor: instance } = fakeEditorEvent();

    editor['emitReady'](event as never);
    expect(editor['editors'].length).toBe(1);

    instance.destroy();

    expect(editor['editors'].length).toBe(0);
  });

  it('erro em um editor ao maximizar é contido e os demais continuam operáveis', () => {
    const { editor } = createHost();
    const failing = {
      on: () => {},
      getCommand: () => { throw new TypeError('editor destruído'); },
    };
    const working = {
      on: () => {},
      getCommand: () => ({ state: 1 }),
      execCommand: jasmine.createSpy('execCommand'),
    };
    editor['emitReady']({ editor: failing } as never);
    editor['emitReady']({ editor: working } as never);
    const errorSpy = spyOn(console, 'error');

    editor['maximize'](false);

    expect(working.execCommand).toHaveBeenCalledWith('maximize');
    expect(errorSpy).toHaveBeenCalled();
    expect(editor['editors']).not.toContain(failing as never);
  });
});

describe('FormEditor voltar com editor maximizado', () => {

  function maximizableEditor() {
    let maximizeListener: (evt: { data: number }) => void = () => {};
    const editor = {
      on: (name: string, callback: (evt: { data: number }) => void) => {
        if (name === 'maximize') {
          maximizeListener = callback;
        }
      },
      getCommand: () => ({ state: 1 }),
      execCommand: jasmine.createSpy('execCommand').and.callFake(() => maximizeListener({ data: 2 })),
    };
    return { editor, emitMaximize: (state: number) => maximizeListener({ data: state }) };
  }

  it('maximizar registra uma entrada no histórico', () => {
    const { editor: instance, emitMaximize } = maximizableEditor();
    const { editor } = createHost();
    editor['emitReady']({ editor: instance } as never);
    const pushSpy = spyOn(history, 'pushState');

    emitMaximize(1);

    expect(pushSpy).toHaveBeenCalled();
  });

  it('voltar com editor maximizado minimiza e não chama history.back', () => {
    const { editor: instance, emitMaximize } = maximizableEditor();
    const { editor } = createHost();
    editor['emitReady']({ editor: instance } as never);
    spyOn(history, 'pushState');
    const backSpy = spyOn(history, 'back');
    emitMaximize(1);

    TestBed.inject(PlataformLocationService).popState.emit();

    expect(instance.execCommand).toHaveBeenCalledWith('maximize');
    expect(backSpy).not.toHaveBeenCalled();
  });

  it('minimizar pelo botão remove a entrada do histórico', () => {
    const { editor: instance, emitMaximize } = maximizableEditor();
    const { editor } = createHost();
    editor['emitReady']({ editor: instance } as never);
    spyOn(history, 'pushState');
    const backSpy = spyOn(history, 'back');
    emitMaximize(1);

    emitMaximize(2);

    expect(backSpy).toHaveBeenCalledTimes(1);
  });

  it('destruir o componente maximizado não navega pelo histórico', () => {
    const { editor: instance, emitMaximize } = maximizableEditor();
    const { fixture, editor } = createHost();
    editor['emitReady']({ editor: instance } as never);
    spyOn(history, 'pushState');
    const backSpy = spyOn(history, 'back');
    emitMaximize(1);

    fixture.destroy();

    expect(backSpy).not.toHaveBeenCalled();
  });
});
