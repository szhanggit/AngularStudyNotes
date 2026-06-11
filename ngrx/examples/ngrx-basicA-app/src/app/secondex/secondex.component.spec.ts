import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondexComponent } from './secondex.component';

describe('SecondexComponent', () => {
  let component: SecondexComponent;
  let fixture: ComponentFixture<SecondexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
