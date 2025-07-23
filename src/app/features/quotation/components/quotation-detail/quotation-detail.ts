import { Component, input } from '@angular/core';
import { QuotationSummary } from '../../types/quotation';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-quotation-detail',
  imports: [CurrencyPipe],
  templateUrl: './quotation-detail.html',
  styleUrl: './quotation-detail.scss'
})
export class QuotationDetail {

  quotationSummary = input<QuotationSummary|null>()

}
