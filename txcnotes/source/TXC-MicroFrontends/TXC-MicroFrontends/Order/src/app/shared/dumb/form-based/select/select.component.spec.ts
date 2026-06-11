import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import { FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { StandardCasePipe } from 'src/app/shared/pipes/standard-case.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SelectModel } from 'src/app/shared/models/dumb-models/select.model';

describe('SelectComponent', () => {
  const NG_CONTROL_PROVIDER = {
    provide: NgControl,
    useClass: class extends NgControl {
      control = new FormControl();
      viewToModelUpdate() {}
    },
  };
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectComponent, StandardCasePipe],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [StandardCasePipe],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(SelectComponent, {
        add: { providers: [NG_CONTROL_PROVIDER] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
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
