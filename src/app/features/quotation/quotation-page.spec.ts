import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationPage} from './quotation-page';

describe('PricePage', () => {
  let component: QuotationPage;
  let fixture: ComponentFixture<QuotationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
