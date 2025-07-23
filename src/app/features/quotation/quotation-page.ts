import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { QuotationCalculator } from './services/quotation-calculator';
import { QuotationService } from './services/quotation-service';
import { QuotationSummary } from './types/quotation';
import { VehicleService } from '../vehicle-catalog/services/vehicle-service';
import { QuotationDetail } from './components/quotation-detail/quotation-detail';
import { QuotationForm } from './components/quotation-form/quotation-form';
import { QuotationRecord } from './components/quotation-record/quotation-record';
import { AlertService } from 'src/app/shared/services/alert-service';


@Component({
  imports: [
    QuotationDetail,
    QuotationForm,
    QuotationRecord,
    FontAwesomeModule],
  providers:[
   QuotationCalculator,
   QuotationService,
   VehicleService
  ],
  selector: 'app-price-page',
  templateUrl: './quotation-page.html',
  styleUrls: ['./quotation-page.scss']
})
export class QuotationPage implements OnInit {
  
  faCar = faCar;

  quotationCalculator = inject(QuotationCalculator)
  quotationService = inject(QuotationService)
  alertService = inject(AlertService)

  quotationRecord: QuotationSummary[] = [];
  quotationSummary?: QuotationSummary | null;
  



  ngOnInit(): void {
    this.getRecord()
  }
  
  getRecord(){
    const quotationRecord = this.quotationService.getAllQuotations()
    if (quotationRecord) this.quotationRecord = quotationRecord;
  }

  onQuotationAdded(value:any): void {

    const { model, brand, year, useType, age } = value;
    
    this.quotationSummary = this.quotationCalculator.calculateQuotationSummary({
      age,
      year,
      useType,
      vehicle: {
        brand,
        model
      }
    })

    if (!this.quotationSummary){
      this.alertService.error('No se encontro una tarifa para este modelo')
      return;
    }


    this.quotationService.createQuotation(this.quotationSummary)
    this.getRecord()
  }




}