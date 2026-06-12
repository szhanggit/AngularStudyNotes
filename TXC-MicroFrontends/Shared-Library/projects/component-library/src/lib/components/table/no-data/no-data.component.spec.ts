import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoDataLibComponent } from './no-data.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NoDataLibComponent', () => {
  let component: NoDataLibComponent;
  let fixture: ComponentFixture<NoDataLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoDataLibComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDataLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default message if no input is provided', () => {
    expect(component.message).toBe('No data to display');
  });

  it('should display the correct message when input is provided', () => {
    const message = 'Test message';
    component.message = message;
    fixture.detectChanges();

    expect(component.message).toBe(message);
  });
});
