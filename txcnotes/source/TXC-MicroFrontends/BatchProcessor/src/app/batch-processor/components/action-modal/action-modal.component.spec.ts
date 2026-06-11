import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionModalComponent } from './action-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ActionModalComponent', () => {
  const activeModalSvcSpy = jasmine.createSpyObj('NgbActiveModal', [
    'dismiss',
    'close',
  ]);
  let component: ActionModalComponent;
  let fixture: ComponentFixture<ActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionModalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSvcSpy },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionModalComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    component.primaryButton = { buttonText: 'Import' };
    component.secondaryButton = { buttonText: 'Cancel' };
    fixture.detectChanges();
    component.getFormValidity();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable button when form is invalid', () => {
    component.formGroup.setErrors({ invalid: true });
    fixture.detectChanges();
    expect(component.isBtnDisabled).toBeTrue();
  });

  it('should enable button when form is valid', () => {
    component.formGroup.setErrors(null);
    fixture.detectChanges();
    expect(component.isBtnDisabled).toBeFalse();
  });

  it('should call activeModal.close and emit primaryButtonClicked event when onPrimaryButtonClicked is called', () => {
    const primaryButtonClickedSpy = spyOn(
      component.primaryButtonClicked,
      'emit'
    );
    component.onPrimaryButtonClicked();
    expect(activeModalSvcSpy.close).toHaveBeenCalledWith('confirm');
    expect(primaryButtonClickedSpy).toHaveBeenCalled();
  });
});
