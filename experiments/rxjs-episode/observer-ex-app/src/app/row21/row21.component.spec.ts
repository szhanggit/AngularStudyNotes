import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row21Component } from './row21.component';

describe('Row21Component', () => {
  let component: Row21Component;
  let fixture: ComponentFixture<Row21Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row21Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row21Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
