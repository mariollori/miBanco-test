import { Component, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Input } from '@components/molecules/input/input';
import { Dropdown } from '@components/molecules/dropdown/dropdown';
import { Button } from '@components/atoms/button/button';
import { Vehicle } from '../../types/vehicle';
import { VehiclesApiService } from '../../../../shared/services/vehicles-api-service';
import { AlertService } from 'src/app/shared/services/alert-service';

@Component({
  selector: 'app-catalog-form',
  imports: [Input, Dropdown, ReactiveFormsModule, Button],
  templateUrl: './catalog-form.html',
  styleUrl: './catalog-form.scss'
})
export class CatalogForm implements OnInit, OnDestroy {


  $destroy: Subject<void> = new Subject<void>()

  formBuilder = inject(FormBuilder);
  formVehicle!: FormGroup;
  vehiclesApiService = inject(VehiclesApiService);
  alertService = inject(AlertService);

  brands = signal<string[]>([])
  models = signal<string[]>([])


  vehicleAdded = output<Vehicle>()


  ngOnInit() {
    this.initForm()
    this.getBrands()
  }

  initForm() {
    this.formVehicle = this.formBuilder.group({
      model: ['', Validators.required],
      brand: ['', Validators.required],
      base_price: [100, [Validators.required,Validators.min(100)]]
    })

    this.formVehicle.get('brand')?.valueChanges
      .pipe(takeUntil(this.$destroy))
      .subscribe(brand => {
        this.formVehicle.get('model')?.setValue('');
        this.getModels(brand);
      });
  }

  getBrands() {
    this.vehiclesApiService.getBrands().pipe(
      takeUntil(this.$destroy)
    ).subscribe((val) => {
      this.brands.set(val)
    })
  }

  getModels(brand: string) {
    this.vehiclesApiService.getModelsByBrand(brand).pipe(
      takeUntil(this.$destroy)
    ).subscribe((val) => {
      this.models.set(val)
    });

  }


  submit() {
    if (!this.formVehicle.valid){
      this.alertService.error('Necesitas completar todos los campos')
      return;
    } 
    this.vehicleAdded.emit(this.formVehicle.value)
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }


}
