import { Component, input } from '@angular/core';
import { QuotationSummary } from '../../types/quotation';
import { QuotationDetail } from '../quotation-detail/quotation-detail';

@Component({
  selector: 'app-quotation-history',
  imports: [QuotationDetail],
  templateUrl: './quotation-record.html',
  styleUrl: './quotation-record.scss'
})
export class QuotationRecord {

  quotationRecord = input<QuotationSummary[]>([])

}
