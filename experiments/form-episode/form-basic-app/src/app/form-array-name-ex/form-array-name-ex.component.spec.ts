import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormArrayNameExComponent } from './form-array-name-ex.component';

describe('FormArrayNameExComponent', () => {
  let component: FormArrayNameExComponent;
  let fixture: ComponentFixture<FormArrayNameExComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormArrayNameExComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormArrayNameExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
