import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { TextboxComponent } from './textbox.component';
import {
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputModel } from 'src/app/shared/models/dumb-models/input.model';
import { StandardCasePipe } from 'src/app/shared/pipes/standard-case.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TextboxComponent', () => {
  const NG_CONTROL_PROVIDER = {
    provide: NgControl,
    useClass: class extends NgControl {
      control = new FormControl();
      viewToModelUpdate() {}
    },
  };
  let component: TextboxComponent;
  let fixture: ComponentFixture<TextboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextboxComponent, StandardCasePipe],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [StandardCasePipe],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(TextboxComponent, {
        add: { providers: [NG_CONTROL_PROVIDER] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TextboxComponent);
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

  describe('linkCopied()', () => {
    it('should set isLinkCopied to true', () => {
      // act
      component.linkCopied();

      // assert
      expect(component.isLinkCopied).toBeTrue();
    });

    it('should reset isLinkCopied to false after 3 secs', fakeAsync(() => {
      // act
      component.linkCopied();
      tick(3000);

      // assert
      expect(component.isLinkCopied).toBeFalse();
    }));
  });
});
