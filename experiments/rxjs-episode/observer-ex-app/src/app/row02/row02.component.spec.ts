import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row02Component } from './row02.component';

describe('Row02Component', () => {
  let component: Row02Component;
  let fixture: ComponentFixture<Row02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row02Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
