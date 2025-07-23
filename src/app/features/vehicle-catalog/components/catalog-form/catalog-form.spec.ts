import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject, throwError } from 'rxjs';
import { CatalogForm } from './catalog-form';
import { VehiclesApiService } from '../../../../shared/services/vehicles-api-service';
import { AlertService } from '../../../../shared/services/alert-service';
import { Input } from '../../../../shared/components/molecules/input/input';
import { Dropdown } from '../../../../shared/components/molecules/dropdown/dropdown';
import { Button } from '../../../../shared/components/atoms/button/button';

describe('CatalogForm', () => {
  let component: CatalogForm;
  let fixture: ComponentFixture<CatalogForm>;
  let mockVehiclesApiService: jasmine.SpyObj<VehiclesApiService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  const mockBrands = ['Toyota', 'Honda', 'Ford'];
  const mockModels = ['Camry', 'Corolla', 'RAV4'];

  beforeEach(async () => {
    const vehiclesApiSpy = jasmine.createSpyObj('VehiclesApiService', ['getBrands', 'getModelsByBrand']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['error', 'success', 'warning', 'info']);

    await TestBed.configureTestingModule({
      imports: [CatalogForm, ReactiveFormsModule,  Input, Dropdown, Button],
      providers: [
        { provide: VehiclesApiService, useValue: vehiclesApiSpy },
        { provide: AlertService, useValue: alertServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogForm);
    component = fixture.componentInstance;
    mockVehiclesApiService = TestBed.inject(VehiclesApiService) as jasmine.SpyObj<VehiclesApiService>;
    mockAlertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;

    mockVehiclesApiService.getBrands.and.returnValue(of(mockBrands));
    mockVehiclesApiService.getModelsByBrand.and.returnValue(of(mockModels));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize form with default values', () => {
      fixture.detectChanges();

      expect(component.formVehicle).toBeDefined();
      expect(component.formVehicle.get('brand')?.value).toBe('');
      expect(component.formVehicle.get('model')?.value).toBe('');
      expect(component.formVehicle.get('base_price')?.value).toBe(100);
    });

    it('should load brands on init', () => {
      fixture.detectChanges();

      expect(mockVehiclesApiService.getBrands).toHaveBeenCalled();
      expect(component.brands()).toEqual(mockBrands);
    });

    it('should initialize empty models array', () => {
      expect(component.models()).toEqual([]);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should require brand field', () => {
      const brandControl = component.formVehicle.get('brand');
      brandControl?.setValue('');
      brandControl?.markAsTouched();

      expect(brandControl?.invalid).toBe(true);
      expect(brandControl?.errors?.['required']).toBe(true);
    });

    it('should require model field', () => {
      const modelControl = component.formVehicle.get('model');
      modelControl?.setValue('');
      modelControl?.markAsTouched();

      expect(modelControl?.invalid).toBe(true);
      expect(modelControl?.errors?.['required']).toBe(true);
    });

    it('should require base_price field', () => {
      const priceControl = component.formVehicle.get('base_price');
      priceControl?.setValue('');

      expect(priceControl?.invalid).toBe(true);
      expect(priceControl?.errors?.['required']).toBe(true);
    });

    it('should validate base_price minimum value', () => {
      const priceControl = component.formVehicle.get('base_price');
      priceControl?.setValue(50);

      expect(priceControl?.invalid).toBe(true);
      expect(priceControl?.errors?.['min']).toBeDefined();
    });

    it('should accept valid base_price', () => {
      const priceControl = component.formVehicle.get('base_price');
      priceControl?.setValue(1000);

      expect(priceControl?.valid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should emit vehicle data when form is valid', () => {
      spyOn(component.vehicleAdded, 'emit');

      component.formVehicle.patchValue({
        brand: 'Toyota',
        model: 'Camry',
        base_price: 25000
      });

      component.submit();

      expect(component.vehicleAdded.emit).toHaveBeenCalledWith({
        id: jasmine.any(Number),
        brand: 'Toyota',
        model: 'Camry',
        base_price: 25000
      });
      expect(mockAlertService.error).not.toHaveBeenCalled();
    });

    it('should show error when form is invalid', () => {
      spyOn(component.vehicleAdded, 'emit');

      component.formVehicle.patchValue({
        brand: '',
        model: '',
        base_price: ''
      });

      component.submit();

      expect(mockAlertService.error).toHaveBeenCalledWith('Necesitas completar todos los campos');
      expect(component.vehicleAdded.emit).not.toHaveBeenCalled();
    });

    it('should show error when base_price is below minimum', () => {
      spyOn(component.vehicleAdded, 'emit');

      component.formVehicle.patchValue({
        brand: 'Toyota',
        model: 'Camry',
        base_price: 50
      });

      component.submit();

      expect(mockAlertService.error).toHaveBeenCalledWith('Necesitas completar todos los campos');
      expect(component.vehicleAdded.emit).not.toHaveBeenCalled();
    });
  });
  describe('Component Lifecycle', () => {
    it('should complete destroy subject on ngOnDestroy', () => {
      spyOn(component.$destroy, 'next');
      spyOn(component.$destroy, 'complete');

      component.ngOnDestroy();

      expect(component.$destroy.next).toHaveBeenCalled();
      expect(component.$destroy.complete).toHaveBeenCalled();
    });

    it('should unsubscribe from observables on destroy', () => {
      const destroySubject = new Subject<void>();
      component.$destroy = destroySubject;
      spyOn(destroySubject, 'next');
      spyOn(destroySubject, 'complete');

      component.ngOnDestroy();

      expect(destroySubject.next).toHaveBeenCalled();
      expect(destroySubject.complete).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle getBrands error gracefully', () => {
      const errorResponse = new Error('API Error');
      mockVehiclesApiService.getBrands.and.returnValue(throwError(() => errorResponse));

      expect(() => component.getBrands()).not.toThrow();
      expect(mockVehiclesApiService.getBrands).toHaveBeenCalled();
    });

    it('should handle getModels error gracefully', () => {
      const errorResponse = new Error('API Error');
      mockVehiclesApiService.getModelsByBrand.and.returnValue(throwError(() => errorResponse));

      expect(() => component.getModels('Toyota')).not.toThrow();
      expect(mockVehiclesApiService.getModelsByBrand).toHaveBeenCalledWith('Toyota');
    });
  });

  
});