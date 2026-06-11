import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row22Component } from './row22.component';

describe('Row22Component', () => {
  let component: Row22Component;
  let fixture: ComponentFixture<Row22Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row22Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row22Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
