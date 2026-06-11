import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row12Component } from './row12.component';

describe('Row12Component', () => {
  let component: Row12Component;
  let fixture: ComponentFixture<Row12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row12Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
