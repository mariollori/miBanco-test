import { Component, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Input } from '@components/molecules/input/input';
import { Dropdown } from '@components/molecules/dropdown/dropdown';
import { Button } from '@components/atoms/button/button';
import { VehiclesApiService } from '../../../../shared/services/vehicles-api-service';
import { AlertService } from 'src/app/shared/services/alert-service';

@Component({
  selector: 'app-quotation-form',
  imports: [Input, Dropdown, ReactiveFormsModule, Button],
  templateUrl: './quotation-form.html',
  styleUrl: './quotation-form.scss'
})
export class QuotationForm implements OnInit, OnDestroy {


  $destroy: Subject<void> = new Subject<void>()

  fb = inject(FormBuilder)
  quotationForm!: FormGroup;

  onQuotationAdded = output<any>()

  vehicleApiService = inject(VehiclesApiService);
  alertService = inject(AlertService);


  brands = signal<string[]>([])
  models = signal<string[]>([])
  tiposUso = ['Personal', 'Trabajo', 'Carga'];

  ngOnInit(): void {
    this.initForm()
    this.getBrands()
  }



  initForm() {
    this.quotationForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: [2025, [Validators.required, Validators.min(1990), Validators.max(new Date().getFullYear())]],
      useType: ['', Validators.required],
      age: [18, [Validators.required, Validators.min(18), Validators.max(99)]]
    });

    this.quotationForm.get('brand')?.valueChanges
      .pipe(takeUntil(this.$destroy))
      .subscribe(brand => {
        this.quotationForm.get('model')?.setValue('');
        this.getModels(brand);
      });

  }

  quotationAdded() {
    if (this.quotationForm.invalid) {
      this.alertService.error('Necesita completar todos los campos');
      return;
    }
    this.onQuotationAdded.emit(this.quotationForm.value)
  }



  getBrands() {
    this.vehicleApiService.getBrands().pipe(
      takeUntil(this.$destroy)
    ).subscribe({
      next: (val) => {
        this.brands.set(val)
      },
      error: (err) => {
      }
    }
    )
  }

  getModels(brand: string) {
    this.vehicleApiService.getModelsByBrand(brand).pipe(
      takeUntil(this.$destroy)
    ).subscribe({
      next: (val) => {
        this.models.set(val)
      },
      error: (err) => {
      }
    }
    )

  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }


}
