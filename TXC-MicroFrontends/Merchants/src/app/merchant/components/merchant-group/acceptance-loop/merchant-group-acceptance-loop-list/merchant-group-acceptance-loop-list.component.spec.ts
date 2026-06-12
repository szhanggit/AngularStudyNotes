import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantGroupAcceptanceLoopListComponent } from './merchant-group-acceptance-loop-list.component';

describe('MerchantGroupAcceptanceLoopListComponent', () => {
  let component: MerchantGroupAcceptanceLoopListComponent;
  let fixture: ComponentFixture<MerchantGroupAcceptanceLoopListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantGroupAcceptanceLoopListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantGroupAcceptanceLoopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
