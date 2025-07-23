import { Component, inject, OnInit } from '@angular/core';
import { CatalogForm } from './components/catalog-form/catalog-form';
import { CatalogList } from './components/catalog-list/catalog-list';
import { VehicleService } from './services/vehicle-service';
import { Vehicle } from './types/vehicle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-catalog-page',
  imports: [CatalogForm, CatalogList,FontAwesomeModule],
  providers:[
    VehicleService
  ],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss'
})
export class CatalogPage implements OnInit {

  faCar = faCar

  vehicles:Vehicle[] = [];
  vehicleService = inject(VehicleService);
  
  

  ngOnInit() {
    this.getAllVehicles()
  }

  getAllVehicles() {
    this.vehicles = this.vehicleService.getAllVehicles();
  }

  onVehicleAdded(newVehicle: Vehicle) {
    this.vehicleService.addVehicle(newVehicle);
    this.getAllVehicles()
  }
  
  onVechicleDelete(id:string){
    this.vehicleService.deleteVehicle(id);
    this.getAllVehicles()
  }

}
