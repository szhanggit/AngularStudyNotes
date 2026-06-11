import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicFormThreeV2Component } from './basic-form-three.v2.component';

describe('BasicFormThreeV2Component', () => {
  let component: BasicFormThreeV2Component;
  let fixture: ComponentFixture<BasicFormThreeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicFormThreeV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicFormThreeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
