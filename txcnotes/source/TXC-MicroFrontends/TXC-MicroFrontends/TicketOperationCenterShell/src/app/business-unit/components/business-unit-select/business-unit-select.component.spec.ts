import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessUnitSelectComponent } from './business-unit-select.component';

describe('SelectComponent', () => {
  let component: BusinessUnitSelectComponent;
  let fixture: ComponentFixture<BusinessUnitSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessUnitSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessUnitSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
