import { TestBed } from '@angular/core/testing';
import { QuotationCalculator } from './quotation-calculator';
import { VehicleService } from '../../vehicle-catalog/services/vehicle-service';
import { Vehicle } from '../../vehicle-catalog/types/vehicle';
import { QuotationInput} from '../types/quotation';

describe('QuotationCalculator', () => {
  let service: QuotationCalculator;
  let mockVehicleService: jasmine.SpyObj<VehicleService>;

  const mockVehicles: Vehicle[] = [
    { id: '1', brand: 'Toyota', model: 'Camry', base_price: 25000 },
    { id: '2', brand: 'Honda', model: 'Civic', base_price: 20000 },
    { id: '3', brand: 'Ford', model: 'Focus', base_price: 18000 }
  ];

  beforeEach(() => {
    const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['getAllVehicles']);

    TestBed.configureTestingModule({
      providers: [
        QuotationCalculator,
        { provide: VehicleService, useValue: vehicleServiceSpy }
      ]
    });

    service = TestBed.inject(QuotationCalculator);
    mockVehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;
    mockVehicleService.getAllVehicles.and.returnValue(mockVehicles);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateVehicle', () => {
    it('should return vehicle when brand and model exist', () => {
      const quotationInput: QuotationInput = {
        vehicle: { brand: 'Toyota', model: 'Camry' },
        age: 30,
        useType: 'Personal',
        year: 2020
      };

      const result = service.validateVehicle(quotationInput);

      expect(result).toEqual(mockVehicles[0]);
      expect(mockVehicleService.getAllVehicles).toHaveBeenCalled();
    });

    it('should return undefined when vehicle does not exist', () => {
      const quotationInput: QuotationInput = {
        vehicle: { brand: 'Nissan', model: 'Sentra' },
        age: 30,
        useType: 'Personal',
        year: 2020
      };

      const result = service.validateVehicle(quotationInput);

      expect(result).toBeUndefined();
    });

    it('should return undefined when brand exists but model does not', () => {
      const quotationInput: QuotationInput = {
        vehicle: { brand: 'Toyota', model: 'Prius' },
        age: 30,
        useType: 'Personal',
        year: 2020
      };

      const result = service.validateVehicle(quotationInput);

      expect(result).toBeUndefined();
    });
  });

  describe('calculateQuotationSummary', () => {
    it('should return null when vehicle does not exist', () => {
      const quotationInput: QuotationInput = {
        vehicle: { brand: 'NonExistent', model: 'Model' },
        age: 30,
        useType: 'Personal',
        year: 2020
      };

      const result = service.calculateQuotationSummary(quotationInput);

      expect(result).toBeNull();
    });

    it('should calculate basic quotation for middle-aged driver with personal use', () => {
      const quotationInput: QuotationInput = {
        vehicle: { brand: 'Toyota', model: 'Camry' },
        age: 30,
        useType: 'Personal',
        year: 2020 
      };

      const result = service.calculateQuotationSummary(quotationInput);

      expect(result).toBeDefined();
      expect(result!.quotation.vehicle).toEqual(mockVehicles[0]);
      expect(result!.quotation.age).toBe(30);
      expect(result!.quotation.useType).toBe('Personal');
      expect(result!.quotation.year).toBe(2020);
      expect(result!.adjustment.adjusmentYear).toBe(12500);
      expect(result!.adjustment.adjusmentAge).toBe(0);
      expect(result!.adjustment.adjusmentType).toBe(3750);
      expect(result!.totalAmount).toBe(41250);
    });

    it('should apply age adjustment for young driver (under 25)', () => {
      const quotationInput: QuotationInput = {
        vehicle: { brand: 'Honda', model: 'Civic' },
        age: 22,  
        useType: 'Personal',
        year: 2024 
      };

      const result = service.calculateQuotationSummary(quotationInput);

      expect(result).toBeDefined();
      expect(result!.adjustment.adjusmentAge).toBe(1000);
      expect(result!.totalAmount).toBe(26000);
    });

    it('should apply age adjustment for elderly driver (over 65)', () => {
      const quotationInput: QuotationInput = {
        vehicle: { brand: 'Ford', model: 'Focus' },
        age: 70,
        useType: 'Trabajo',
        year: 2023 
      };

      const result = service.calculateQuotationSummary(quotationInput);

      expect(result).toBeDefined();
      expect(result!.adjustment.adjusmentAge).toBe(900);
      expect(result!.adjustment.adjusmentType).toBe(3600);
      expect(result!.totalAmount).toBe(26100);
    });

    it('should handle different use types correctly', () => {
      const baseQuotation: QuotationInput = {
        vehicle: { brand: 'Toyota', model: 'Camry' },
        age: 30,
        useType: 'Carga',  
        year: 2025
      };

      const result = service.calculateQuotationSummary(baseQuotation);

      expect(result).toBeDefined();
      expect(result!.adjustment.adjusmentYear).toBe(0);
      expect(result!.adjustment.adjusmentAge).toBe(0);
      expect(result!.adjustment.adjusmentType).toBe(6250);
      expect(result!.totalAmount).toBe(31250);
    });

  

    it('should handle future year correctly (no negative age)', () => {
      const quotationInput: QuotationInput = {
        vehicle: { brand: 'Toyota', model: 'Camry' },
        age: 30,
        useType: 'Personal',
        year: 2030 
      };

      const result = service.calculateQuotationSummary(quotationInput);

      expect(result).toBeDefined();
      expect(result!.adjustment.adjusmentYear).toBe(0);
    });

    it('should calculate correctly for very old vehicle', () => {
      const quotationInput: QuotationInput = {
        vehicle: { brand: 'Honda', model: 'Civic' },
        age: 40,
        useType: 'Personal',
        year: 2010,
      };

      const result = service.calculateQuotationSummary(quotationInput);

      expect(result).toBeDefined();

     
      expect(result!.adjustment.adjusmentYear).toBe(30000);
      expect(result!.totalAmount).toBe(53000);
    });
  });

});