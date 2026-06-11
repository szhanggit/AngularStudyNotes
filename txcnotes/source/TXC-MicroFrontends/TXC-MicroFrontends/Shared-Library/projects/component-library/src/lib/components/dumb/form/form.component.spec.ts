import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormLibComponent } from './form.component';

describe('FormLibComponent', () => {
  let component: FormLibComponent;
  let fixture: ComponentFixture<FormLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormLibComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
