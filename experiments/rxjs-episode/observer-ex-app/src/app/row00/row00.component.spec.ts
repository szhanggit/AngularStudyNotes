import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row00Component } from './row00.component';

describe('Row00Component', () => {
  let component: Row00Component;
  let fixture: ComponentFixture<Row00Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row00Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row00Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
