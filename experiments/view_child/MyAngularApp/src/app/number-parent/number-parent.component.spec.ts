import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberParentComponent } from './number-parent.component';

describe('NumberParentComponent', () => {
  let component: NumberParentComponent;
  let fixture: ComponentFixture<NumberParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberParentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
