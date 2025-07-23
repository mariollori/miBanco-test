import { Component, input, output } from '@angular/core';
import { Vehicle } from '../../types/vehicle';
import { CurrencyPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-catalog-list',
  imports: [CurrencyPipe, FontAwesomeModule],
  templateUrl: './catalog-list.html',
  styleUrl: './catalog-list.scss'
})
export class CatalogList {

  faTrash = faTrash;

  vehiclesList = input.required<Vehicle[]>()

  vehicleDelete = output<string>()


  onDeleteItem(id: string) {
    this.vehicleDelete.emit(id);
  }
}
