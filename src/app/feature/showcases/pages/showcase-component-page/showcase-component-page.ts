import { Component, inject, TemplateRef, Type } from '@angular/core';
import { ModalRef, ModalService } from '@app/shared/services';
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

  protected open<T>(comp: Type<T>|TemplateRef<T>): ModalRef {
    return this.modal.open(comp, {
      backdrop : true,
      centered: false
    });
  }

  protected openForm(): void {
    var item = this.open(ShowcaseFormPage);
    var comp = item.componentInstance as ShowcaseFormPage;
    comp.form.patchValue({
      textArea: 'Atribundo algum valor...'
    });
    comp.form.disable();

    this.open(ShowcaseFormPage);
    this.open(ShowcaseFormPage);
  }

}
