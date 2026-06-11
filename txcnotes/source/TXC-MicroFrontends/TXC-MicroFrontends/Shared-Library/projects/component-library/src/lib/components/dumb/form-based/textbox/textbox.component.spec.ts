import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TextboxLibComponent } from './textbox.component';
import { InputModel } from 'projects/component-library/src/public-api';

describe('TextboxComponent', () => {
  const NG_CONTROL_PROVIDER = {
    provide: NgControl,
    useClass: class extends NgControl {
      control = new FormControl();
      viewToModelUpdate() {}
    },
  };
  let component: TextboxLibComponent;
  let fixture: ComponentFixture<TextboxLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextboxLibComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(TextboxLibComponent, {
        add: { providers: [NG_CONTROL_PROVIDER] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TextboxLibComponent);
    component = fixture.componentInstance;
    component.textBoxModel = {
      label: 'test',
    } as InputModel;
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
      component.writeValue('test');

      // assert
      expect(component.value).toBe('test');
    });
  });
});
