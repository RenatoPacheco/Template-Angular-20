import { Component, inject, Input } from "@angular/core";
import { ControlContainer, FormControl } from "@angular/forms";

@Component({
    standalone: true,
    selector: 'app-form-radio',
    templateUrl: './form-radio.html'
})
export class FormRadio {

  private controlContainer = inject(ControlContainer);

  @Input() controlName!: string;
  @Input() value: unknown;

  public get control(): FormControl {
      return this.controlContainer.control?.get(this.controlName) as FormControl;
  }

  public get checked(): boolean {
      return this.control.value === this.value;
  }

  protected onToggle(event: Event): void {
      this.control.setValue(this.value);
      this.control.markAsTouched();
  }
}