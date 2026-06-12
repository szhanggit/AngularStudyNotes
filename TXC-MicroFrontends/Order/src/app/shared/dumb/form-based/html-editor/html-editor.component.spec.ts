import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';

import { HtmlEditorComponent } from './html-editor.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StandardCasePipe } from 'src/app/shared/pipes/standard-case.pipe';
import { InputModel } from 'src/app/shared/models/dumb-models/input.model';

describe('HtmlEditorComponent', () => {
  const NG_CONTROL_PROVIDER = {
    provide: NgControl,
    useClass: class extends NgControl {
      control = new FormControl();
      viewToModelUpdate() {}
    },
  };

  let component: HtmlEditorComponent;
  let fixture: ComponentFixture<HtmlEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HtmlEditorComponent, StandardCasePipe],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [StandardCasePipe],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(HtmlEditorComponent, {
        add: { providers: [NG_CONTROL_PROVIDER] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HtmlEditorComponent);
    component = fixture.componentInstance;
    component.htmlEditorModel = {
      label: 'test',
      formControlName: 'test',
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

  describe('onHTMLTextChanged()', () => {
    it('should call onChanged', () => {
      // arrange
      const onChangedSpy = spyOn(component, 'onChange');

      // act
      component.onHTMLTextChanged({ target: { innerHTML: 'string' } });

      // assert
      expect(onChangedSpy).toHaveBeenCalled();
    });
  });
});
