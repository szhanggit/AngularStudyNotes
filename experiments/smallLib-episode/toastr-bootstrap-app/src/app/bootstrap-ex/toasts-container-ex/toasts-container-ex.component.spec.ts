import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastsContainerExComponent } from './toasts-container-ex.component';

describe('ToastsContainerExComponent', () => {
  let component: ToastsContainerExComponent;
  let fixture: ComponentFixture<ToastsContainerExComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToastsContainerExComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastsContainerExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
