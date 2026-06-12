import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgControllerComponent } from './svg-controller.component';

describe('SvgControllerComponent', () => {
  let component: SvgControllerComponent;
  let fixture: ComponentFixture<SvgControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgControllerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
