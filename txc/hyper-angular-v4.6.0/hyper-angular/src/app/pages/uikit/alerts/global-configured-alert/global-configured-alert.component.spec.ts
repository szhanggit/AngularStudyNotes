import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalConfiguredAlertComponent } from './global-configured-alert.component';

describe('GlobalConfiguredAlertComponent', () => {
  let component: GlobalConfiguredAlertComponent;
  let fixture: ComponentFixture<GlobalConfiguredAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalConfiguredAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalConfiguredAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
