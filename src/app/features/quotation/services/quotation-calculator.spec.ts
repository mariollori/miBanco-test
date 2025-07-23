import { TestBed } from '@angular/core/testing';

import { QuotationCalculator } from './quotation-calculator';

describe('QuotationCalculator', () => {
  let service: QuotationCalculator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuotationCalculator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
