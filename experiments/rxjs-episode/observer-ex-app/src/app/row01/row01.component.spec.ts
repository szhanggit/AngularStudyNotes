import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row01Component } from './row01.component';

describe('Row01Component', () => {
  let component: Row01Component;
  let fixture: ComponentFixture<Row01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row01Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
