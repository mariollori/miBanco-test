import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { QuotationForm } from './quotation-form';
import { VehiclesApiService } from '../../../../shared/services/vehicles-api-service';
import { AlertService } from '../../../../shared/services/alert-service';
import { Input } from '../../../../shared/components/molecules/input/input';
import { Dropdown } from '../../../../shared/components/molecules/dropdown/dropdown';
import { Button } from '../../../../shared/components/atoms/button/button';

describe('QuotationForm', () => {
  let component: QuotationForm;
  let fixture: ComponentFixture<QuotationForm>;
  let mockVehiclesApiService: jasmine.SpyObj<VehiclesApiService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  const mockBrands = ['Toyota', 'Honda', 'Ford'];
  const mockModels = ['Camry', 'Corolla', 'RAV4'];

  beforeEach(async () => {

    const vehiclesApiSpy = jasmine.createSpyObj('VehiclesApiService', ['getBrands', 'getModelsByBrand']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['error', 'success', 'warning', 'info']);

    await TestBed.configureTestingModule({
      imports: [QuotationForm, ReactiveFormsModule,Input, Dropdown, Button],
      providers: [
        { provide: VehiclesApiService, useValue: vehiclesApiSpy },
        { provide: AlertService, useValue: alertServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotationForm);
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

      expect(component.quotationForm).toBeDefined();
      expect(component.quotationForm.get('brand')?.value).toBe('');
      expect(component.quotationForm.get('model')?.value).toBe('');
      expect(component.quotationForm.get('year')?.value).toBe(2025);
      expect(component.quotationForm.get('useType')?.value).toBe('');
      expect(component.quotationForm.get('age')?.value).toBe(18);
    });

    it('should load brands on init', () => {
      fixture.detectChanges();

      expect(mockVehiclesApiService.getBrands).toHaveBeenCalled();
      expect(component.brands()).toEqual(mockBrands);
    });

    it('should initialize tiposUso array', () => {
      expect(component.tiposUso).toEqual(['Personal', 'Trabajo', 'Carga']);
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
      const brandControl = component.quotationForm.get('brand');
      brandControl?.setValue('');
      brandControl?.markAsTouched();

      expect(brandControl?.invalid).toBe(true);
      expect(brandControl?.errors?.['required']).toBe(true);
    });

    it('should require model field', () => {
      const modelControl = component.quotationForm.get('model');
      modelControl?.setValue('');
      modelControl?.markAsTouched();

      expect(modelControl?.invalid).toBe(true);
      expect(modelControl?.errors?.['required']).toBe(true);
    });

    it('should require useType field', () => {
      const useTypeControl = component.quotationForm.get('useType');
      useTypeControl?.setValue('');
      useTypeControl?.markAsTouched();

      expect(useTypeControl?.invalid).toBe(true);
      expect(useTypeControl?.errors?.['required']).toBe(true);
    });

    it('should validate year minimum value', () => {
      const yearControl = component.quotationForm.get('year');
      yearControl?.setValue(1985);

      expect(yearControl?.invalid).toBe(true);
      expect(yearControl?.errors?.['min']).toBeDefined();
    });

    it('should validate year maximum value', () => {
      const yearControl = component.quotationForm.get('year');
      const currentYear = new Date().getFullYear();
      yearControl?.setValue(currentYear + 1);

      expect(yearControl?.invalid).toBe(true);
      expect(yearControl?.errors?.['max']).toBeDefined();
    });

    it('should accept valid year', () => {
      const yearControl = component.quotationForm.get('year');
      yearControl?.setValue(2020);

      expect(yearControl?.valid).toBe(true);
    });

    it('should validate age minimum value', () => {
      const ageControl = component.quotationForm.get('age');
      ageControl?.setValue(17);

      expect(ageControl?.invalid).toBe(true);
      expect(ageControl?.errors?.['min']).toBeDefined();
    });

    it('should validate age maximum value', () => {
      const ageControl = component.quotationForm.get('age');
      ageControl?.setValue(100);

      expect(ageControl?.invalid).toBe(true);
      expect(ageControl?.errors?.['max']).toBeDefined();
    });

    it('should accept valid age', () => {
      const ageControl = component.quotationForm.get('age');
      ageControl?.setValue(25);

      expect(ageControl?.valid).toBe(true);
    });
  });


  describe('Form Submission', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should emit quotation data when form is valid', () => {
      spyOn(component.onQuotationAdded, 'emit');

      component.quotationForm.patchValue({
        brand: 'Toyota',
        model: 'Camry',
        year: 2020,
        useType: 'Personal',
        age: 25
      });

      component.quotationAdded();

      expect(component.onQuotationAdded.emit).toHaveBeenCalledWith({
        brand: 'Toyota',
        model: 'Camry',
        year: 2020,
        useType: 'Personal',
        age: 25
      });
      expect(mockAlertService.error).not.toHaveBeenCalled();
    });

    it('should show error when form is invalid', () => {
      spyOn(component.onQuotationAdded, 'emit');

      component.quotationForm.patchValue({
        brand: '',
        model: '',
        year: 2025,
        useType: '',
        age: 18
      });

      component.quotationAdded();

      expect(mockAlertService.error).toHaveBeenCalledWith('Necesita completar todos los campos');
      expect(component.onQuotationAdded.emit).not.toHaveBeenCalled();
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
});