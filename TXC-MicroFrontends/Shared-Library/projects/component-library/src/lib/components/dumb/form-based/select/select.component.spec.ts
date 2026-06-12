import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SelectLibComponent } from './select.component';
import { SelectModel } from 'projects/component-library/src/public-api';

describe('SelectLibComponent', () => {
  const NG_CONTROL_PROVIDER = {
    provide: NgControl,
    useClass: class extends NgControl {
      control = new FormControl();
      viewToModelUpdate() {}
    },
  };
  let component: SelectLibComponent;
  let fixture: ComponentFixture<SelectLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectLibComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(SelectLibComponent, {
        add: { providers: [NG_CONTROL_PROVIDER] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SelectLibComponent);
    component = fixture.componentInstance;
    component.selectModel = {
      label: 'test',
    } as SelectModel;
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
      // arrange
      component.firstLoad = false;

      // act
      component.writeValue(1);

      // assert
      expect(component.value).toBe(1);
    });
  });

  describe('onSelectUpdate()', () => {
    it('should set the current value', () => {
      // arrange
      component.firstLoad = false;
      const onChangedSpy = spyOn(component, 'onChange');

      
      // act
      component.onSelectUpdate(1);

      // assert
      expect(onChangedSpy).toHaveBeenCalled();
    });
  });
});
