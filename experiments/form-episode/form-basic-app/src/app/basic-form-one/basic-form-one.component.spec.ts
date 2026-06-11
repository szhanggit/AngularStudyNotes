import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicFormOneComponent } from './basic-form-one.component';

describe('BasicFormOneComponent', () => {
  let component: BasicFormOneComponent;
  let fixture: ComponentFixture<BasicFormOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicFormOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicFormOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
