import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicFormThreeV3Component } from './basic-form-three.v3.component';

describe('BasicFormThreeV3Component', () => {
  let component: BasicFormThreeV3Component;
  let fixture: ComponentFixture<BasicFormThreeV3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicFormThreeV3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicFormThreeV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
