import { Injectable } from '@angular/core';
import { StorageService } from '../../../shared/services/storage-service';
import { Vehicle } from '../types/vehicle';

@Injectable()
export class VehicleService extends StorageService<Vehicle[]> {

  constructor() {
    super('vehicle_data', 'local'); 
  }

  getAllVehicles(): Vehicle[] {
    return this.getItem() || [];
  }

  getVehicleById(id: string): Vehicle | undefined {
    return this.getAllVehicles().find(v => v.id === id);
  }

  addVehicle(vehicle: Omit<Vehicle, 'id'>): Vehicle {
    const vehicles = this.getAllVehicles();
    const newVehicle: Vehicle = {
      ...vehicle,
      id: this.generateId()
    };
    this.setItem([...vehicles, newVehicle]);
    return newVehicle;
  }

  updateVehicle(id: string, vehicleData: Partial<Vehicle>): Vehicle | null {
    const vehicles = this.getAllVehicles();
    const index = vehicles.findIndex(v => v.id === id);

    if (index === -1) return null;

    const updatedVehicle = { ...vehicles[index], ...vehicleData, id };
    vehicles[index] = updatedVehicle;
    this.setItem(vehicles);
    return updatedVehicle;
  }

  deleteVehicle(id: string): boolean {
    const vehicles = this.getAllVehicles();
    const newVehicles = vehicles.filter(v => v.id !== id);

    if (newVehicles.length === vehicles.length) return false;

    this.setItem(newVehicles);
    return true;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }


}
