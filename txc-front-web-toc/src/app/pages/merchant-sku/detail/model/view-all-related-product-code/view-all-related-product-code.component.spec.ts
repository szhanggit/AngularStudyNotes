import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllRelatedProductCodeComponent } from './view-all-related-product-code.component';

describe('ViewAllRelatedProductCodeComponent', () => {
  let component: ViewAllRelatedProductCodeComponent;
  let fixture: ComponentFixture<ViewAllRelatedProductCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllRelatedProductCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllRelatedProductCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
