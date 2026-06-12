import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRMOrderListComponent } from './order-list.component';

describe('CRMOrderListComponent', () => {
  let component: CRMOrderListComponent;
  let fixture: ComponentFixture<CRMOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CRMOrderListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CRMOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
