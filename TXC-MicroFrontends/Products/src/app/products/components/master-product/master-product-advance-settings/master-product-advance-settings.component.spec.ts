import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProductAdvanceSettingsComponent } from './master-product-advance-settings.component';

describe('MasterProductAdvanceSettingsComponent', () => {
  let component: MasterProductAdvanceSettingsComponent;
  let fixture: ComponentFixture<MasterProductAdvanceSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterProductAdvanceSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterProductAdvanceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
