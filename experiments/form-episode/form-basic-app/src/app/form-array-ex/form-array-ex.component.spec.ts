import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormArrayExComponent } from './form-array-ex.component';

describe('FormArrayExComponent', () => {
  let component: FormArrayExComponent;
  let fixture: ComponentFixture<FormArrayExComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormArrayExComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormArrayExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
