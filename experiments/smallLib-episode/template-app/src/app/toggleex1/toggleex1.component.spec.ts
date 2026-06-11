import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Toggleex1Component } from './toggleex1.component';

describe('Toggleex1Component', () => {
  let component: Toggleex1Component;
  let fixture: ComponentFixture<Toggleex1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Toggleex1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Toggleex1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
