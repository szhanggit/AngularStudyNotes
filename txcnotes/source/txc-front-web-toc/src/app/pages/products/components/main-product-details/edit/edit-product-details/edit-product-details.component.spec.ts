import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductDetailsComponent } from './edit-product-details.component';

describe('EditProductDetailsComponent', () => {
  let component: EditProductDetailsComponent;
  let fixture: ComponentFixture<EditProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProductDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
