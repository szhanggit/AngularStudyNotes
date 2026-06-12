import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadQuotationAreaComponent } from './upload-quotation-area.component';

describe('UploadQuotationAreaComponent', () => {
  let component: UploadQuotationAreaComponent;
  let fixture: ComponentFixture<UploadQuotationAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadQuotationAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadQuotationAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
