import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row20Component } from './row20.component';

describe('Row20Component', () => {
  let component: Row20Component;
  let fixture: ComponentFixture<Row20Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row20Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
