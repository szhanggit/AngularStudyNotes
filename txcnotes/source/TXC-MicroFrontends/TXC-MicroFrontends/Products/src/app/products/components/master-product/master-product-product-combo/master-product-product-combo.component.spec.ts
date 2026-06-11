import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProductProductComboComponent } from './master-product-product-combo.component';

describe('MasterProductProductComboComponent', () => {
  let component: MasterProductProductComboComponent;
  let fixture: ComponentFixture<MasterProductProductComboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterProductProductComboComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterProductProductComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
