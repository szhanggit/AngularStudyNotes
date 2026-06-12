import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessageLibComponent } from './error-message.component';

describe('ErrorMessageLibComponent', () => {
  let component: ErrorMessageLibComponent;
  let fixture: ComponentFixture<ErrorMessageLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorMessageLibComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageLibComponent);
    component = fixture.componentInstance;
    component.errorMessages = [{ type: '', description: '' }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
