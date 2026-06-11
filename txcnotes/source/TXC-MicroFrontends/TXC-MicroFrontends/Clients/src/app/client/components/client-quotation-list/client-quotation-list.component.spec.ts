import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientQuotationListComponent } from './client-quotation-list.component';

describe('ClientQuotationListComponent', () => {
  let component: ClientQuotationListComponent;
  let fixture: ComponentFixture<ClientQuotationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientQuotationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientQuotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
