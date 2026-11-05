import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
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

function createHost(type: new () => unknown = HostEditor) {
  TestBed.configureTestingModule({ imports: [ type ], providers: [ provideZonelessChangeDetection() ] });
  const fixture = TestBed.createComponent(type);
  fixture.detectChanges();
  const area = fixture.debugElement.query(By.directive(FormEditor));
  const editor = area.componentInstance as FormEditor;
  return {
    fixture,
    editor,
    component: editor,
    host: fixture.componentInstance as { control: FormControl<string | null> },
    root: area.nativeElement as HTMLElement,
  };
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

@Component({
  imports: [ ReactiveFormsModule, FormEditor ],
  template: `<app-form-editor label="Texto" paragraph="false" height="300" [formControl]="control" />`
})
class HostEditorNoParagraph {
  control = new FormControl<string | null>(null);
}

@Component({
  imports: [ ReactiveFormsModule, FormEditor ],
  template: `<app-form-editor label="Texto" [loading]="loading()" [formControl]="control" />`
})
class HostEditorLoading {
  loading = signal(true);
  control = new FormControl<string | null>('abc');
}

describe('FormEditor configuração e normalização', () => {

  it('normalizeValue remove parágrafos quando paragraph é falso', () => {
    const { editor } = createHost(HostEditorNoParagraph);

    expect(editor['normalizeValue']('<p>a</p><p>b</p>')).toBe('a<br />b');
  });

  it('normalizeValue mantém parágrafos quando paragraph é verdadeiro', () => {
    const { editor } = createHost();

    expect(editor['normalizeValue']('<p>a</p>')).toBe('<p>a</p>');
  });

  it('configs usam height informado e enterMode de quebra de linha quando paragraph é falso', () => {
    const { editor } = createHost(HostEditorNoParagraph);

    for (const config of [editor['basicConfig'](), editor['completeConfig'](), editor['disabledConfig']()]) {
      expect(config['height']).toBe(300);
      expect(config['enterMode']).toBe(2);
      expect(config['autoParagraph']).toBeFalse();
    }
  });
});

describe('FormEditor foco, id e carregamento', () => {

  it('foco no editor sem alteração mantém o campo não tocado', () => {
    const { host, fixture } = createHost();
    const ckeditor = fixture.debugElement.query(By.css('ckeditor'));

    ckeditor.triggerEventHandler('focus', {});
    fixture.detectChanges();

    expect(host.control.touched).toBeFalse();
  });

  it('saída do editor marca o campo como tocado', () => {
    const { host, fixture } = createHost();
    const ckeditor = fixture.debugElement.query(By.css('ckeditor'));

    ckeditor.triggerEventHandler('blur', {});
    fixture.detectChanges();

    expect(host.control.touched).toBeTrue();
  });

  it('o bloco do modo mobile usa o mesmo id do label', () => {
    const { component, fixture } = createHost();
    component['_mobile'].set(true);
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('label[app-label]')).nativeElement as HTMLLabelElement;
    const ckeditor = fixture.debugElement.query(By.css('ckeditor'));

    expect(label.getAttribute('for')).toBe(component.id);
    expect((ckeditor.nativeElement as HTMLElement).id).toBe(component.id);
  });

  it('com loading ativo o label exibe o indicador de carregamento', () => {
    const { root } = createHost(HostEditorLoading);

    expect(root.querySelector('i.loading')).not.toBeNull();
  });
});

describe('FormEditor clique no label', () => {

  function focusableEditor() {
    return {
      on: () => {},
      getCommand: () => ({ state: 2 }),
      focus: jasmine.createSpy('focus'),
    };
  }

  it('clicar no label foca o editor habilitado', () => {
    const { editor, root, fixture } = createHost();
    const instance = focusableEditor();
    editor['emitReady']({ editor: instance } as never);
    fixture.detectChanges();

    (root.querySelector('label[app-label]') as HTMLElement).click();

    expect(instance.focus).toHaveBeenCalled();
  });

  it('clicar em um ícone do label não foca o editor', () => {
    const { editor, root, fixture } = createHost();
    const instance = focusableEditor();
    editor['emitReady']({ editor: instance } as never);
    fixture.detectChanges();
    const label = root.querySelector('label[app-label]') as HTMLElement;
    const icon = document.createElement('i');
    icon.setAttribute('role', 'alert');
    label.appendChild(icon);

    icon.click();

    expect(instance.focus).not.toHaveBeenCalled();
  });
});

describe('FormEditor valor vazio', () => {

  it('normalizeValue converte string vazia em null', () => {
    const { editor } = createHost();

    expect(editor['normalizeValue']('')).toBeNull();
  });

  it('apagar o conteúdo resulta em null no FormControl', () => {
    const { editor, host } = createHost();

    editor['commitValue']('');

    expect(host.control.value).toBeNull();
  });

  it('escrita programática de string vazia resulta em null no FormControl e permanece pristine', () => {
    const { fixture, host } = createHost();

    host.control.setValue('');
    fixture.detectChanges();

    expect(host.control.value).toBeNull();
    expect(host.control.pristine).toBeTrue();
  });
});
