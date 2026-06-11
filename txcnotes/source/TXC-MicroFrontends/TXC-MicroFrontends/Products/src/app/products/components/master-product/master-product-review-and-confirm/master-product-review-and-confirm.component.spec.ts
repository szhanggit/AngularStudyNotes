import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProductReviewAndConfirmComponent } from './master-product-review-and-confirm.component';

describe('MasterProductReviewAndConfirmComponent', () => {
  let component: MasterProductReviewAndConfirmComponent;
  let fixture: ComponentFixture<MasterProductReviewAndConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterProductReviewAndConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterProductReviewAndConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
