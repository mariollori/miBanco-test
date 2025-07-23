import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, input, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { ControlError } from '../../atoms/control-error/control-error';

@Component({
  selector: 'app-dropdown',
  imports: [ControlError],
  templateUrl: './dropdown.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Dropdown),
      multi: true
    }
  ],
  styleUrl: './dropdown.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class Dropdown implements ControlValueAccessor {

  dropdownTrigger = viewChild<ElementRef>('dropdownTrigger');
  dropdownMenu = viewChild<ElementRef>('dropdownMenu');

  isOpen = signal(false);
  selectedOption = signal<number | object | undefined>(undefined);

  readonly label = input<string>('')
  readonly options = input<any[]>([])
  readonly optionLabel = input<string>('label')
  readonly optionValue = input<string>('value')
  readonly placeholder = input<string>('Selecciona una opción');

  disabled: boolean = false;
  error = input<ValidationErrors | null | undefined>(null);
  touched = input<boolean|undefined>(false);


  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };



  writeValue(value: any): void {
    this.selectedOption.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown() {
    this.onTouched()
    if (this.disabled) return;

    this.isOpen.update(v => !v);
  }

  selectOption(option: any) {
    const value = option[this.optionValue()] ?? option;
    this.selectedOption.set(value);
    this.onChange(value);
    this.onTouched();
    this.isOpen.set(false);
  }

  getSelectedLabel(): string {
    if (!this.selectedOption()) return '';

    const selected = this.options().find(option =>
      (option[this.optionValue()] ?? option) === this.selectedOption()
    );

    return selected ? selected[this.optionLabel()] || selected : String(this.selectedOption());
  }

  isOptionSelected(option: any): boolean {
    const optionValue = option[this.optionValue()] ?? option;
    return optionValue === this.selectedOption();
  }

}
