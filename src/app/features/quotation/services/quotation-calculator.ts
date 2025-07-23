import { inject, Injectable } from '@angular/core';
import { Quotation, QuotationInput, QuotationSummary } from '../types/quotation';
import { VehicleService } from '../../vehicle-catalog/services/vehicle-service';
import { Vehicle } from '../../vehicle-catalog/types/vehicle';

@Injectable()
export class QuotationCalculator {

  vehicleService = inject(VehicleService)

  private readonly BASE_PRICE_PER_YEAR: number = 0.10;
  private readonly BASE_PRICE_PER_AGE: number = 0.05;
  private readonly AGE_YOUNG_LIMIT: number = 25;
  private readonly AGE_OLD_LIMIT: number = 65;
  private readonly BASE_USE_TYPE_PERCENTS: Record<string, number> = {
    "PERSONAL": 0.15,
    "TRABAJO": 0.20,
    "CARGA": 0.25,
  };

  validateVehicle({ vehicle: { brand, model } }: QuotationInput): Vehicle | undefined {

    const vehicleExist = this.vehicleService.getAllVehicles()
      .find((value: Vehicle) => (value.brand === brand && value.model === model))

    return vehicleExist;
  }


  calculateQuotationSummary(quotationInput: QuotationInput): QuotationSummary | null {

    const currVehicle = this.validateVehicle(quotationInput);

    if (!currVehicle) return null;

    const { age, useType, year } = quotationInput;

    const basePrice: number = Number(currVehicle.base_price);
    const currentYear = new Date().getFullYear();

    const vehicleAge = Math.max(0, currentYear - year)
    const adjusmentYear: number = (basePrice * this.BASE_PRICE_PER_YEAR) * vehicleAge;

    let adjusmentAge = 0;
    if (age < this.AGE_YOUNG_LIMIT || age > this.AGE_OLD_LIMIT) {
      adjusmentAge = (basePrice * this.BASE_PRICE_PER_AGE);
    }

    const useTypeFactor = this.BASE_USE_TYPE_PERCENTS[useType.toUpperCase()];
    const adjusmentType: number = basePrice * useTypeFactor;

    const totalAmount:number = basePrice + adjusmentYear + adjusmentAge + adjusmentType;

    const quotation: Quotation = {
      age: age,
      useType: useType,
      year: year,
      vehicle: currVehicle
    }

    const adjustment= {
      adjusmentAge,
      adjusmentType,
      adjusmentYear
    }

    return {
      quotation,
      adjustment,
      totalAmount
    };

  }

}