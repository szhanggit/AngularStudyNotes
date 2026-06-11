import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingCtrlComponent } from './rating-ctrl.component';

describe('RatingCtrlComponent', () => {
  let component: RatingCtrlComponent;
  let fixture: ComponentFixture<RatingCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingCtrlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
