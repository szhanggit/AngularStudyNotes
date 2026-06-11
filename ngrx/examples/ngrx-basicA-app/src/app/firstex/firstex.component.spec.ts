import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstexComponent } from './firstex.component';

describe('FirstexComponent', () => {
  let component: FirstexComponent;
  let fixture: ComponentFixture<FirstexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
