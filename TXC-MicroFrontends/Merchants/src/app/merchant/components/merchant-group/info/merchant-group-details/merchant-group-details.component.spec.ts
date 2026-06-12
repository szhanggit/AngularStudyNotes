import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantGroupDetailsComponent } from './merchant-group-details.component';

describe('MerchantGroupDetailsComponent', () => {
  let component: MerchantGroupDetailsComponent;
  let fixture: ComponentFixture<MerchantGroupDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantGroupDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantGroupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
