import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row10Component } from './row10.component';

describe('Row10Component', () => {
  let component: Row10Component;
  let fixture: ComponentFixture<Row10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row10Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
