import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProductProductDetailsComponent } from './master-product-product-details.component';

describe('MasterProductProductDetailsComponent', () => {
  let component: MasterProductProductDetailsComponent;
  let fixture: ComponentFixture<MasterProductProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterProductProductDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterProductProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
