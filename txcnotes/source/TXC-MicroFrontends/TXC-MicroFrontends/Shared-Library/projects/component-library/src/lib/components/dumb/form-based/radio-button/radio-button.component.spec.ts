import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RadioButtonLibComponent } from './radio-button.component';
import { RadioButtonModel } from 'projects/component-library/src/public-api';

describe('RadioButtonLibComponent', () => {
  const NG_CONTROL_PROVIDER = {
    provide: NgControl,
    useClass: class extends NgControl {
      control = new FormControl();
      viewToModelUpdate() {}
    },
  };
  let component: RadioButtonLibComponent;
  let fixture: ComponentFixture<RadioButtonLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioButtonLibComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(RadioButtonLibComponent, {
        add: { providers: [NG_CONTROL_PROVIDER] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RadioButtonLibComponent);
    component = fixture.componentInstance;
    component.radioButtonModel = {
      label: 'test',
    } as RadioButtonModel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('controlErrors()', () => {
    it('should return []', () => {
      // assert
      expect(component.controlErrors).toEqual([]);
    });

    it('should return errors', () => {
      // act
      component.controlDir.control?.setErrors({ required: true });

      // assert
      expect(component.controlErrors).toEqual(['required']);
    });
  });

  describe('writeValue()', () => {
    it('should set the current value', () => {
      // act
      component.writeValue(1);

      // assert
      expect(component.value).toBe(1);
    });
  });
});
