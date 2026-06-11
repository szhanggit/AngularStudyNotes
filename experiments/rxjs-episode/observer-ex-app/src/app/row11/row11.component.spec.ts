import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row11Component } from './row11.component';

describe('Row11Component', () => {
  let component: Row11Component;
  let fixture: ComponentFixture<Row11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row11Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
