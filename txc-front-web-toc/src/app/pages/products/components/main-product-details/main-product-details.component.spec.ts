import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainProductDetailsComponent } from './main-product-details.component';

describe('MainProductDetailsComponent', () => {
  let component: MainProductDetailsComponent;
  let fixture: ComponentFixture<MainProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainProductDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
