import { Component, inject, TemplateRef, Type } from '@angular/core';
import { ModalOptions, ModalRef, ModalService } from '@app/shared/services';
import { ShowcaseFormPage } from '../showcase-form-page/showcase-form-page';

@Component({
  standalone: true,
  selector: 'app-showcase-style-page',
  imports: [],
  templateUrl: './showcase-component-page.html',
  styleUrl: './showcase-component-page.scss',
})
export class ShowcaseComponentPage {

  private modal = inject(ModalService);

  protected open<T>(
    comp: Type<T>|TemplateRef<T>, 
    options?: ModalOptions
  ): ModalRef {
    return this.modal.open(comp, {
      backdrop : true,
      centered: false,
      ...options
    });
  }

  protected openForm(options?: ModalOptions): void {
    var item = this.open(ShowcaseFormPage, {
      fullscreen: true,
      ...options
    });
    var comp = item.componentInstance as ShowcaseFormPage;
    comp.form.patchValue({
      textArea: 'Atribundo algum valor...'
    });
    comp.form.disable();

    this.open(ShowcaseFormPage, {
      centered:true,
      ...options
    });
    this.open(ShowcaseFormPage, {
      ...options
    });
  }

}
