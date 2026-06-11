import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicFormThreeComponent } from './basic-form-three.component';

describe('BasicFormThreeComponent', () => {
  let component: BasicFormThreeComponent;
  let fixture: ComponentFixture<BasicFormThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicFormThreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicFormThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
