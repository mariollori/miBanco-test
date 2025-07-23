import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuotationRecord } from './quotation-record';


describe('QuotationHistory', () => {
  let component: QuotationRecord;
  let fixture: ComponentFixture<QuotationRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotationRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
