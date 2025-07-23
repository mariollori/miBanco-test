import { Injectable } from '@angular/core';
import { StorageService } from '../../../shared/services/storage-service';
import { QuotationSummary } from '../types/quotation';


@Injectable()
export class QuotationService extends StorageService<QuotationSummary[]> {
  constructor() {
    super('quotation_data', 'session');
  }

  getAllQuotations(): QuotationSummary[] {
    return this.getItem() || [];
  }

  createQuotation(quotationSummary:QuotationSummary) {
    const quotations = this.getAllQuotations();
    quotations.unshift(quotationSummary);
    const limit = quotations.slice(0, 3);
    this.setItem([...limit]);
  }


}