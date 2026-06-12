import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantAcceptanceLoopListComponent } from './merchant-acceptance-loop-list.component';

describe('MerchantAcceptanceLoopListComponent', () => {
  let component: MerchantAcceptanceLoopListComponent;
  let fixture: ComponentFixture<MerchantAcceptanceLoopListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantAcceptanceLoopListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantAcceptanceLoopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
