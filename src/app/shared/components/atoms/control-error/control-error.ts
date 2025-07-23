import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-control-error',
  imports: [CommonModule],
  templateUrl: './control-error.html',
  styleUrl: './control-error.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ControlError {

  error = input<ValidationErrors | null | undefined>()
  touched = input<boolean | undefined>(false)



  filterMessage(errorName: string, erroValue: any): string {
    const errorsMessages: Record<string, string> = {
      'required': 'Este campo es requerido',
      'min': `El minimo permitido es ${erroValue.min}`,
      'max': `El maximo permitido es ${erroValue.max}`
    }
    return errorsMessages[errorName]

  }

  get errorMessage(): string | null {
    if (this.error() && this.touched()) {
      for (const propertyName in this.error()) {
        if (this.error()!.hasOwnProperty(propertyName)) {
          return this.filterMessage(propertyName, this.error()![propertyName]);
        }
      }
    }
    return null;
  }

}
