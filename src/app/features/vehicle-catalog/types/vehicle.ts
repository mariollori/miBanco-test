export interface VehicleBase{
    brand:string
    model:string
}

export interface Vehicle extends VehicleBase{
    id:string
    base_price:number
}