import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Toggleex2Component } from './toggleex2.component';

describe('Toggleex2Component', () => {
  let component: Toggleex2Component;
  let fixture: ComponentFixture<Toggleex2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Toggleex2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Toggleex2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
