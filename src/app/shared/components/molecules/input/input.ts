import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { ControlError } from '../../atoms/control-error/control-error';

@Component({
  selector: 'app-input',
  templateUrl: './input.html',
  imports:[ControlError],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true
    },

  ],
  styleUrl: './input.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class Input implements ControlValueAccessor {

  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly label = input<string>('');
  error = input<ValidationErrors | null | undefined>(null);
  touched = input<boolean|undefined>(false);


  disabled: boolean = false
  value: string = ''

  onChange = (value: string) => { }
  onTouched = () => { }

  writeValue(value: string): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled
  }


}
