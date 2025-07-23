import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
interface VehicleMock {
  brand: string;
  models: string[];
}


@Injectable({
  providedIn: 'root'
})
export class VehiclesApiService {

  http = inject(HttpClient)

  getBrands(): Observable<string[]> {
    return this.http.get<VehicleMock[]>('/mocks/vehicles.json').pipe(
      map(data => data.map(item => item.brand))
    );
  }

  getModelsByBrand(brand: string): Observable<string[]> {
    return this.http.get<VehicleMock[]>('/mocks/vehicles.json').pipe(
      map(data => data.find(item => item.brand === brand)?.models ?? [])
    );
  }
}
