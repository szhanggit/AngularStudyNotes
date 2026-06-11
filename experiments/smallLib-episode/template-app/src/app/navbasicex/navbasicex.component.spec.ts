import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbasicexComponent } from './navbasicex.component';

describe('NavbasicexComponent', () => {
  let component: NavbasicexComponent;
  let fixture: ComponentFixture<NavbasicexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbasicexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbasicexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
