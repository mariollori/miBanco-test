import { Vehicle, VehicleBase } from "../../vehicle-catalog/types/vehicle";

export interface Quotation {
    useType: string
    age: number
    year: number
    vehicle: Vehicle
}


export interface QuotationInput {
    useType: string
    age: number
    year: number
    vehicle: VehicleBase
}

export interface QuotationSummary {
    quotation: Quotation,
    totalAmount: number,
    adjustment: Adjusment
}

interface Adjusment {
    adjusmentYear: number
    adjusmentAge: number
    adjusmentType: number
}