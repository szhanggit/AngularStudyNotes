import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicFormTwoComponent } from './basic-form-two.component';

describe('BasicFormTwoComponent', () => {
  let component: BasicFormTwoComponent;
  let fixture: ComponentFixture<BasicFormTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicFormTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicFormTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
