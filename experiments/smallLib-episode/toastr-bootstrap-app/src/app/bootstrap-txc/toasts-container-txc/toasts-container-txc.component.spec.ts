import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastsContainerTXCComponent } from './toasts-container-txc.component';

describe('ToastsContainerTXCComponent', () => {
  let component: ToastsContainerTXCComponent;
  let fixture: ComponentFixture<ToastsContainerTXCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToastsContainerTXCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastsContainerTXCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
